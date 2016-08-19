var fs = require("fs");
var path = require("path");
var _ = require("underscore");
var shutils = require("shutils");
var filesystem = shutils.filesystem;
var StringUtils = require("underscore.string");

var uglify = require('gulp-uglify');
var CmdNice = require("gulp-cmd-nice");
var rename = require("gulp-rename");
var gulpFilter = require('gulp-filter');
var gulpif = require('gulp-if');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var watch = require('gulp-watch');
var extend = require("extend");

var argv = require('yargs').argv;

if (argv.mobile) {
    var sourcePath = argv.src || "mobile-src";
    var distPath = argv.dist || "dist/mobile";
} else {
    var sourcePath = argv.src || "src";
    var distPath = argv.dist || "dist";
}
var cssDirName = argv.cssDir || null;
var packageJson = require("./package.json");

var build = function(gulp, opt) {
    var options = {
        transport: {
            success: null,
            fail: null
        },
        debug: {
            success: null,
            fail: null
        },
        concat: {
            success: null,
            fail: null
        }
    };
    if (_.isObject(opt)) {
        extend(true, options, opt);
    }
    // seajs的别名和路径
    var configContent = {
        alias: {},
        paths: {}
    };
    var configFile = null;
    if (argv.config && fs.existsSync(argv.config)) {
        configFile = argv.config;
    }
    else {
        configFile = path.join(process.cwd(), sourcePath, "config.js");
    }
    var isConfigFileExist = fs.existsSync(configFile);
    if (isConfigFileExist) {
        configContent = fs.readFileSync(configFile, "utf-8");
        configContent = eval(configContent);
    }

    var defaultLessPaths = [
        path.join(process.cwd(), sourcePath)
    ];
    var defaultCssPaths = [
        path.join(process.cwd(), sourcePath)
    ];

    filesystem.listTreeSync(path.join(__dirname, sourcePath)).forEach(function(filePath) {
        var extName = path.extname(filePath);
        if (extName === ".less") {
            defaultLessPaths.push(path.dirname(filePath));
        }
        if (extName === ".css") {
            defaultCssPaths.push(path.dirname(filePath));
        }
    });

    var transportConfig = {
        rootPath: path.join(process.cwd(), sourcePath),
        paths: [
            path.join(process.cwd(), sourcePath)
        ],
        useCache: true,
        alias: configContent.alias,
        aliasPaths: configContent.paths,
        idRule: function(name) {
            return packageJson.family + "/" + packageJson.name + "/" + packageJson.version + (argv.mobile ? '/mobile/' : '/')  + name;
        },
        handlebars: {
            id: configContent.alias.handlebars || 'gallery/handlebars/1.0.2/runtime',
            knownHelpers: [
                "if", "each"
            ]
        },
        lessOptions: {
            paths: [
                path.normalize(path.join(__dirname, sourcePath, "css"))
            ]
        },
        cssOptions: {
            paths: [
                path.normalize(path.join(__dirname, sourcePath, "css"))
            ]
        },
        success: options.transport.success,
        fail: options.transport.fail
    };

    var debugOptions = {
        paths: [
            path.normalize(path.join(__dirname, distPath))
        ],
        success: options.debug.success,
        fail: options.debug.fail
    };

    var getTransportSource = function() {
        return gulp.src([
            sourcePath + "/**/*.js",
            sourcePath + "/**/*.handlebars",
            sourcePath + "/**/*.tpl",
            sourcePath + "/**/*.html",
            sourcePath + "/**/*.json",
            sourcePath + "/**/*.css",
            sourcePath + "/**/*.less",
            sourcePath + "/**/*.scss"
        ]);
    };

    var handleTransport = function(source) {
        return source.pipe(gulpFilter(function(file) {
            var extName = path.extname(file.path);
            if (!cssDirName) {
                return true;
            }
            if (!_.contains([".css", ".less", "scss"], extName)) {
                return true;
            }
            if (!isConfigFileExist) {
                return true;
            }
            var items = file.path.split(path.sep);
            return !_.contains(items.slice(0, items.length - 1), cssDirName);
        })).pipe(CmdNice.cmdTransport(transportConfig)).pipe(rename(function(file) {
            if (file.extname !== ".js") {
                file.extname += ".js";
            }
        })).pipe(gulp.dest(distPath)).pipe(CmdNice.cmdDebug(debugOptions)).pipe(rename(function(file) {
            var extName = path.extname(file.basename);
            if (!extName) {
                file.extname = "-debug.js"
            }
            else {
                file.basename = StringUtils.rstrip(file.basename, {source: extName});
                file.extname = "-debug" + extName + file.extname;
            }
        })).pipe(gulp.dest(distPath))
    };

    gulp.task('transport', function() {
        return handleTransport(getTransportSource());
    });

    var isNotDebugFile = function(file) {
        var stats = fs.lstatSync(file.path);
        return stats.isFile() && !/\-debug.*?\.js/.test(file.path);
    };

    gulp.task("concat_scripts", ["transport"], function() {
        return gulp.src([distPath + "/**/*.js"]).pipe(CmdNice.cmdConcat({
            paths: [
                path.normalize(path.join(__dirname, distPath))
            ],
            useCache: true,
            idExtractor: function(name) {
                var pattern = packageJson.family +
                    "/" +
                    packageJson.name +
                    "/" +
                    packageJson.version +
                    (argv.mobile ? "/mobile/" : "/") +
                    "(.*)";
                pattern = new RegExp(pattern, "g");
                var matched = pattern.exec(name);
                if (matched) {
                    return matched[1];
                }
                else {
                    return name;
                }
            },
            success: options.concat.success,
            fail: options.concat.fail
        })).pipe(gulpFilter(function(file) {
            var items = path.dirname(file.path).split(path.sep);
            return _.contains(items, "c") || _.contains(items, "p") || _.contains(items, "w");
        }))
            .pipe(gulp.dest(distPath)).pipe(gulpif(isNotDebugFile, uglify({
            mangle: false
        }))).pipe(gulp.dest(distPath));
    });

    gulp.task("less", function() {
        return gulp.src(sourcePath + "/**/*.less").pipe(less({
            paths: isConfigFileExist ? [
                path.normalize(path.join(__dirname, sourcePath, "css"))
            ] : defaultLessPaths,
            cleancss: true,
            compress: false,
            ieCompat: true
        })).pipe(gulp.dest(sourcePath));
    });

    gulp.task("cssmin", function() {
        return gulp.src(sourcePath + "/**/*.css").pipe(minifyCSS({
            keepBreaks: false,
            keepSpecialComments: 0,
            benchmark: false,
            debug: false,
            compatibility: true,
            noAdvanced: true,
            processImport: true
        })).pipe(gulp.dest(distPath));
    });

    gulp.task("copy", function() {
        return gulp.src([
                sourcePath + "/**/*.jpg",
                sourcePath + "/**/*.jpeg",
                sourcePath + "/**/*.gif",
                sourcePath + "/**/*.png",
                sourcePath + "/**/*.woff",
                sourcePath + "/**/*.swf",
                sourcePath + "/**/*.html"
        ]).pipe(gulp.dest(distPath));
    });

    gulp.task("watch", function() {
        handleTransport(getTransportSource().pipe(watch()));
        gulp.watch(sourcePath + "/**/*.less", ["less"]);
        gulp.watch(sourcePath + "/**/*.css", ["cssmin"]);
    });

    gulp.task("default", ["concat_scripts", "cssmin", "copy"]);
};

if (require.main && !_.isEmpty(require.main)) {
    build(require("gulp"));
}

module.exports = build;
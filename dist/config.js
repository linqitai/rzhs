(function() {
    var root = this;
    var config = {
        alias: {
            "seajs-debug": "seajs/seajs-debug/1.1.1/seajs-debug",
            $: "../../c/js/base/zepto.js",
            cookie: "../../c/js/base/zepto.cookie.js",
            callbacks: "../../c/js/base/zepto.callbacks.js",
            deferred: "../../c/js/base/zepto.deferred.js",
            touch: "../../c/js/base/zepto.touch.js",
            fx: "../../c/js/base/zepto.jx.js",
            sm: "../../c/js/base/sm.js",
            dragloader: "../../c/js/base/dragloader.js",
            "sm-extend": "../../c/js/base/sm-extend.js",
            "sm-city-picker": "../../c/js/base/sm-city-picker-extend.js",
            "sm-router": "../../c/js/base/sm.router.js",
            handlebars: "alinw/handlebars/1.3.0/runtime",
            validator: "../../c/js/mvalidate.js",
            tools: "../../c/js/tools.js",
            swiper: "../../c/js/base/swiper.js",
            fastclick: "../../c/js/fastclick.js",
            area: "../../c/js/area.js",
            moment: "../../c/js/moment.js",
            common: "../../p/common/index.js",
            iscroll: "../../c/js/iscroll-infinite.js",
            registerHelper: "../../c/js/registerHelper"
        },
        paths: {},
        comboSyntax: ["??", ","],
        comboMaxLength: 1e3,
        charset: "utf-8",
        timeout: 1e3,
        debug: true
    };
    if (root.seajs) {
        if (typeof define === "function") {
            define("xg/jx-business/1.0.0/config", [], function(require, exports, module) {
                module.exports = config
            })
        }
        root.seajs.config(config)
    }
    return config
}).call(this);
define("xg/jx-business/1.0.0/c/js/registerHelper-debug", ["alinw/handlebars/1.3.0/runtime-debug"], function(require, exports, module) {
    var Handlebars = require("alinw/handlebars/1.3.0/runtime-debug");
    Handlebars.registerHelper("ifCond", function(v1, operator, v2, options) {
        switch (operator) {
            case "!=":
                return v1 != v2 ? options.fn(this) : options.inverse(this);
            case "==":
                return v1 == v2 ? options.fn(this) : options.inverse(this);
            case "===":
                return v1 === v2 ? options.fn(this) : options.inverse(this);
            case "<":
                return v1 < v2 ? options.fn(this) : options.inverse(this);
            case "<=":
                return v1 <= v2 ? options.fn(this) : options.inverse(this);
            case ">":
                return v1 > v2 ? options.fn(this) : options.inverse(this);
            case ">=":
                return v1 >= v2 ? options.fn(this) : options.inverse(this);
            case "&&":
                return v1 && v2 ? options.fn(this) : options.inverse(this);
            case "||":
                return v1 || v2 ? options.fn(this) : options.inverse(this);
            default:
                return options.inverse(this)
        }
    });
    Handlebars.compilePlus = function(source, context, options) {
        var html = "",
            template;
        if (typeof context !== "object") {
            return html
        }
        if (Handlebars.compile && typeof source === "string") {
            template = Handlebars.compile(source);
            html = template(context, options)
        } else {
            html = source(context, options)
        }
        return html
    };
    Handlebars.registerHelper("addOne", function(index) {
        return index + 1
    });
    Handlebars.registerHelper("addTwo", function(index) {
        return index + 2
    });
    Handlebars.registerHelper("if_even", function(value, options) {
        if (value % 2 == 0) {
            return options.fn(this)
        } else {
            return options.inverse(this)
        }
    })
});
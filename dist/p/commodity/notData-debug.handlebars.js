define("xg/jx-business/1.0.0/p/commodity/notData-debug.handlebars", ["alinw/handlebars/1.3.0/runtime-debug"], function(require, exports, module) {
    var Handlebars = require("alinw/handlebars/1.3.0/runtime-debug");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [4, ">= 1.0.0"];
        helpers = this.merge(helpers, Handlebars.helpers);
        data = data || {};
        return '<div class="missing">\r\n   <img src="http://static.hpbanking.com/xg/uploads/files/6c038b5768301c51fc839c06f93cc4e7-120-120.png" alt="">\r\n   <div>暂无记录</div>\r\n</div>'
    })
});
define("xg/jx-business/1.0.0/p/home/menuList-debug.handlebars", ["alinw/handlebars/1.3.0/runtime-debug"], function(require, exports, module) {
    var Handlebars = require("alinw/handlebars/1.3.0/runtime-debug");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [4, ">= 1.0.0"];
        helpers = this.merge(helpers, Handlebars.helpers);
        data = data || {};
        var buffer = "",
            stack1, functionType = "function",
            escapeExpression = this.escapeExpression,
            self = this,
            helperMissing = helpers.helperMissing;

        function program1(depth0, data) {
            var buffer = "",
                stack1, helper, options;
            buffer += "\r\n\t\t    \t";
            stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
                hash: {},
                inverse: self.program(4, program4, data),
                fn: self.program(2, program2, data),
                data: data
            }, helper ? helper.call(depth0, data == null || data === false ? data : data.index, "==", "0", options) : helperMissing.call(depth0, "ifCond", data == null || data === false ? data : data.index, "==", "0", options));
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "\r\n\t\t    ";
            return buffer
        }

        function program2(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n\t        \t\t<li class="goods-li active swiper-slide" data-page="1" data-id="';
            if (helper = helpers.id) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.id;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '"><span>全部</span></li>\r\n\t        \t';
            return buffer
        }

        function program4(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n\t        \t\t<li class="goods-li swiper-slide" data-id="';
            if (helper = helpers.id) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.id;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '"><span>';
            if (helper = helpers.name) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.name;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + "</span></li>\r\n\t\t        ";
            return buffer
        }

        function program6(depth0, data) {
            var buffer = "",
                stack1, helper, options;
            buffer += "\r\n\t\t";
            stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
                hash: {},
                inverse: self.program(9, program9, data),
                fn: self.program(7, program7, data),
                data: data
            }, helper ? helper.call(depth0, data == null || data === false ? data : data.index, "==", "0", options) : helperMissing.call(depth0, "ifCond", data == null || data === false ? data : data.index, "==", "0", options));
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "\r\n    ";
            return buffer
        }

        function program7(depth0, data) {
            return '\r\n\t\t    <div class="goods-info" style="display: block">\r\n\t\t    \t<div class="goods-info-list">\r\n\r\n\t\t    \t</div>\r\n\t\t    \t<!-- 已经全部加载全部 -->\r\n                <div class="search-no-data-2">\t\t\t            \r\n\t\t            <div class="search-no-log">已经全部加载</div>\r\n\t\t        </div>\r\n\t\t    \t<!-- 暂无数据提示 -->\r\n                <div class="search-no-data">\r\n\t\t            <img src="http://static.hpbanking.com/xg/uploads/files/10f825fd8a0668d92becf7a9571ac777-120-120.png" class="no-img">\r\n\t\t            <div class="search-no-log">暂无记录</div>\r\n\t\t        </div>\r\n\t\t        <!-- 加载提示符 -->\r\n                <div class="infinite-scroll-preloader J_loading">\r\n                    <div class="preloader"></div>\r\n                </div>\r\n\t\t    </div>\r\n    \t'
        }

        function program9(depth0, data) {
            return '\r\n\t    \t<div class="goods-info">\r\n\t    \t\t<div class="goods-info-list">\r\n\r\n\t\t    \t</div>\r\n\t\t    \t<!-- 已经全部加载全部 -->\r\n                <div class="search-no-data-2">\t\t\t            \r\n\t\t            <div class="search-no-log">已经全部加载</div>\r\n\t\t        </div>\r\n\t\t    \t<!-- 暂无数据提示 -->\r\n\t            <div class="search-no-data">\r\n\t\t            <img src="http://static.hpbanking.com/xg/uploads/files/10f825fd8a0668d92becf7a9571ac777-120-120.png" class="no-img">\r\n\t\t            <div class="search-no-log">暂无记录</div>\r\n\t\t        </div>\r\n\t\t         <!-- 加载提示符 -->\r\n                <div class="infinite-scroll-preloader J_loading">\r\n                    <div class="preloader"></div>\r\n                </div>\r\n\t    \t</div>\r\n\t    '
        }
        buffer += '<nav class="goods-nav" id="J_goods_nav">\r\n\t<img src="http://static.hpbanking.com/xg/uploads/files/e619f7dc6bff0a6354839136f99f3eb4-20-70.png" class="menu-mask">\r\n\t<div id="J_menu">     \r\n\t    <ul class="swiper-wrapper">\r\n\t    \t';
        stack1 = helpers.each.call(depth0, depth0, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1
        }
        buffer += '\r\n\t    </ul>\t\t                       \r\n\t</div>\r\n</nav>                    \r\n<div class="goods-list" id="J_goods_list">\r\n\t';
        stack1 = helpers.each.call(depth0, depth0, {
            hash: {},
            inverse: self.noop,
            fn: self.program(6, program6, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1
        }
        buffer += "      \r\n</div>\r\n";
        return buffer
    })
});
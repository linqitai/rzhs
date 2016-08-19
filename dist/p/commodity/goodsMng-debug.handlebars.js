define("xg/jx-business/1.0.0/p/commodity/goodsMng-debug.handlebars", ["alinw/handlebars/1.3.0/runtime-debug"], function(require, exports, module) {
    var Handlebars = require("alinw/handlebars/1.3.0/runtime-debug");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [4, ">= 1.0.0"];
        helpers = this.merge(helpers, Handlebars.helpers);
        data = data || {};
        var stack1, functionType = "function",
            escapeExpression = this.escapeExpression,
            self = this;

        function program1(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n<div class="goodsList">\r\n    <div class="upperBox">\r\n        <a href="/product/goodDetails/goodsDetails.htm?id=';
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
            buffer += escapeExpression(stack1) + '" external>\r\n            <div class="upperBox-left">\r\n                <img src="';
            if (helper = helpers.zoomPicPath) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.zoomPicPath;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '" alt="">\r\n            </div>\r\n            <div class="upperBox-right">            \r\n                <div class="titleFont">';
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
            buffer += escapeExpression(stack1) + ' </div>\r\n                <div class="viewFont">\r\n                    <div class="money">&yen; ';
            if (helper = helpers.showPrice) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.showPrice;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + "</div>\r\n                    ";
            stack1 = helpers.unless.call(depth0, depth0 && depth0.status, {
                hash: {},
                inverse: self.program(4, program4, data),
                fn: self.program(2, program2, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += '\r\n                </div>            \r\n            </div>\r\n        </a>\r\n    </div>\r\n    <div class="downBox">\r\n        ';
            stack1 = helpers.unless.call(depth0, depth0 && depth0.status, {
                hash: {},
                inverse: self.program(8, program8, data),
                fn: self.program(6, program6, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += '\r\n        <div class="downBox-left editgoods" data-goodid="';
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
            buffer += escapeExpression(stack1) + '">编辑</div>\r\n        <div class="downBox-right deletegoods" data-goodid="';
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
            buffer += escapeExpression(stack1) + '">删除</div>\r\n    </div>\r\n</div>\r\n';
            return buffer
        }

        function program2(depth0, data) {
            return '\r\n                        <div class="status over">已下架</div>\r\n                    '
        }

        function program4(depth0, data) {
            return '\r\n                        <div class="status">在售</div>\r\n                    '
        }

        function program6(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n            <div class="downBox-left upgoods" data-goodid="';
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
            buffer += escapeExpression(stack1) + '">上架</div>\r\n        ';
            return buffer
        }

        function program8(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n            <div class="downBox-left downgoods" data-goodid="';
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
            buffer += escapeExpression(stack1) + '">下架</div>\r\n        ';
            return buffer
        }
        stack1 = helpers.each.call(depth0, depth0, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            return stack1
        } else {
            return ""
        }
    })
});
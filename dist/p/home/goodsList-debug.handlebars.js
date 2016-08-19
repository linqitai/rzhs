define("xg/jx-business/1.0.0/p/home/goodsList-debug.handlebars", ["alinw/handlebars/1.3.0/runtime-debug"], function(require, exports, module) {
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
            buffer += "            \r\n            ";
            stack1 = (helper = helpers.if_even || depth0 && depth0.if_even, options = {
                hash: {},
                inverse: self.program(4, program4, data),
                fn: self.program(2, program2, data),
                data: data
            }, helper ? helper.call(depth0, data == null || data === false ? data : data.index, options) : helperMissing.call(depth0, "if_even", data == null || data === false ? data : data.index, options));
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "           \r\n    ";
            return buffer
        }

        function program2(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n                <li class="odd">\r\n                    <a class="goods-info-wrap" href="/product/goodDetails/goodsDetails.htm?id=';
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
            buffer += escapeExpression(stack1) + '&order=1" external>\r\n                        <div class="goods-pic">\r\n                            <img src="';
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
            buffer += escapeExpression(stack1) + '">\r\n                        </div>\r\n                        <div class="goods-txt">\r\n                            ';
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
            buffer += escapeExpression(stack1) + '\r\n                        </div>\r\n                        <div class="goods-price">\r\n                            <div class="goods-price">\r\n                                <div class="goods-price-new"><i>&yen</i>';
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
            buffer += escapeExpression(stack1) + '</div>\r\n                                <!-- <div class="goods-price-old"><i>&yen</i>58.80</div> -->\r\n                            </div>\r\n                        </div>\r\n                    </a>\r\n                </li>\r\n            ';
            return buffer
        }

        function program4(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n                <li>\r\n                    <a class="goods-info-wrap" href="/product/goodDetails/goodsDetails.htm?id=';
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
            buffer += escapeExpression(stack1) + '&order=1" external>\r\n                        <div class="goods-pic">\r\n                            <img src="';
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
            buffer += escapeExpression(stack1) + '">\r\n                        </div>\r\n                        <div class="goods-txt">\r\n                            ';
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
            buffer += escapeExpression(stack1) + '\r\n                        </div>\r\n                        <div class="goods-price">\r\n                            <div class="goods-price">\r\n                                <div class="goods-price-new"><i>&yen</i>';
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
            buffer += escapeExpression(stack1) + '</div>\r\n                                <!-- <div class="goods-price-old"><i>&yen</i>58.80</div> -->\r\n                            </div>\r\n                        </div>\r\n                    </a>\r\n                </li>\r\n            ';
            return buffer
        }
        buffer += '<ul class="list-container">\r\n    ';
        stack1 = helpers.each.call(depth0, depth0, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1
        }
        buffer += "\r\n</ul>\r\n    \r\n";
        return buffer
    })
});
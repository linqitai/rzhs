define("xg/jx-business/1.0.0/p/commodity/allOrder-debug.handlebars", ["alinw/handlebars/1.3.0/runtime-debug"], function(require, exports, module) {
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
            buffer += "\r\n    ";
            stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
                hash: {},
                inverse: self.noop,
                fn: self.program(2, program2, data),
                data: data
            }, helper ? helper.call(depth0, depth0 && depth0.status, "==", 0, options) : helperMissing.call(depth0, "ifCond", depth0 && depth0.status, "==", 0, options));
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "\r\n    ";
            stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
                hash: {},
                inverse: self.noop,
                fn: self.program(4, program4, data),
                data: data
            }, helper ? helper.call(depth0, depth0 && depth0.status, "==", 1, options) : helperMissing.call(depth0, "ifCond", depth0 && depth0.status, "==", 1, options));
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "\r\n    ";
            stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
                hash: {},
                inverse: self.noop,
                fn: self.program(6, program6, data),
                data: data
            }, helper ? helper.call(depth0, depth0 && depth0.status, "==", 2, options) : helperMissing.call(depth0, "ifCond", depth0 && depth0.status, "==", 2, options));
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "\r\n    ";
            stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
                hash: {},
                inverse: self.noop,
                fn: self.program(8, program8, data),
                data: data
            }, helper ? helper.call(depth0, depth0 && depth0.status, "==", 3, options) : helperMissing.call(depth0, "ifCond", depth0 && depth0.status, "==", 3, options));
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "\r\n";
            return buffer
        }

        function program2(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n        <!--已预约（预约中）-->\r\n        <div class="orderList">\r\n            <div class="orderMeLine1">\r\n                <span class="customer left">心有灵犀一点通</span>\r\n                <div class="createTimeBox right"><span>创建时间：</span><span class="createTime">';
            if (helper = helpers.createTime) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.createTime;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '</span></div>\r\n            </div>\r\n            <div class="goodsInfo">\r\n                <a href="/product/goodDetails/goodsDetails.htm?id=';
            if (helper = helpers.productId) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.productId;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '" external><img class="goodsPic left" src="';
            if (helper = helpers.imgUrl) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.imgUrl;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '"></a>\r\n                <div class="rightBox">\r\n                    <a href="/product/goodDetails/goodsDetails.htm?id=';
            if (helper = helpers.productId) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.productId;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '">\r\n                        <div class="goodsName">';
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
            buffer += escapeExpression(stack1) + '</div>\r\n                        <div class="priceBox">\r\n                            <div class="goodsPrice">\r\n                                <span>';
            if (helper = helpers.price) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.price;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '</span>\r\n                                <span class="goodsNumber f5">&Chi;</span>\r\n                                <span class="goodsNumber">';
            if (helper = helpers.amount) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.amount;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '</span>\r\n                            </div>\r\n                            <div class="lastLine">\r\n                                <div class="orderStatus left fb">\r\n                                    已预约\r\n                                </div>\r\n                                <div class="right rep-m">\r\n                                    使用代金券<span class="voucher">';
            if (helper = helpers.discount) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.discount;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '</span>元\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                    </a>\r\n                    <div class="btnGroup">\r\n                        <div class="orderTotalPriceBox left">\r\n                            <div class="boxMiddle"><span>合计：</span><span class="orderTotalPrice">&yen ';
            if (helper = helpers.totalPrice) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.totalPrice;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '</span></div>\r\n                        </div>\r\n                        <div class="sure sureBtn confirm-ok-cancel" id="sureBtn" data-id="';
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
            buffer += escapeExpression(stack1) + '">确认消费</div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    ';
            return buffer
        }

        function program4(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n        <!--已发货（待确认）-->\r\n        <div class="orderList">\r\n            <div class="orderMeLine1">\r\n                <span class="customer left">心有灵犀一点通</span>\r\n                <div class="createTimeBox right"><span>创建时间：</span><span class="createTime">';
            if (helper = helpers.createTime) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.createTime;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '</span></div>\r\n            </div>\r\n            <div class="goodsInfo">\r\n                <a href="/product/goodDetails/goodsDetails.htm?id=';
            if (helper = helpers.productId) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.productId;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '" external>\r\n                    <img class="goodsPic left" src="';
            if (helper = helpers.imgUrl) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.imgUrl;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '">\r\n                </a>\r\n                <div class="rightBox">\r\n                    <a href="/product/goodDetails/goodsDetails.htm?id=';
            if (helper = helpers.productId) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.productId;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '" external>\r\n                        <div class="goodsName">';
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
            buffer += escapeExpression(stack1) + '</div>\r\n                        <div class="priceBox">\r\n                            <div class="goodsPrice">\r\n                                ';
            if (helper = helpers.price) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.price;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '\r\n                                <span class="goodsNumber f5">&Chi;</span>\r\n                                <span class="goodsNumber">';
            if (helper = helpers.amount) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.amount;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '</span>\r\n                            </div>\r\n                            <div class="lastLine">\r\n                                <div class="orderStatus left fb">\r\n                                    等待买家确认\r\n                                </div>\r\n                                <div class="right rep-m">\r\n                                    使用代金券<span class="voucher">';
            if (helper = helpers.discount) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.discount;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '</span>元\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                    </a>\r\n                    <div class="btnGroup">\r\n                        <div class="orderTotalPriceBox right">\r\n                            <div class="boxMiddle"><span>合计：</span><span class="orderTotalPrice">&yen ';
            if (helper = helpers.totalPrice) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.totalPrice;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + "</span></div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    ";
            return buffer
        }

        function program6(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n        <!--确认收货-->\r\n        <div class="orderList">\r\n            <div class="orderMeLine1">\r\n                <span class="customer left">心有灵犀一点通</span>\r\n                <div class="createTimeBox right"><span>创建时间：</span><span class="createTime">';
            if (helper = helpers.createTime) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.createTime;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '</span></div>\r\n            </div>\r\n            <div class="goodsInfo">\r\n                <a href="/product/goodDetails/goodsDetails.htm?id=';
            if (helper = helpers.productId) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.productId;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '" external>\r\n                    <img class="goodsPic left" src="';
            if (helper = helpers.imgUrl) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.imgUrl;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '">\r\n                </a>\r\n                <div class="rightBox">\r\n                    <a href="/product/goodDetails/goodsDetails.htm?id=';
            if (helper = helpers.productId) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.productId;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '" external>\r\n                        <div class="goodsName">';
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
            buffer += escapeExpression(stack1) + '</div>\r\n                        <div class="priceBox">\r\n                            <div class="goodsPrice">\r\n                                ';
            if (helper = helpers.price) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.price;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '\r\n                                <span class="goodsNumber f5">&Chi;</span>\r\n                                <span class="goodsNumber">';
            if (helper = helpers.amount) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.amount;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '</span>\r\n                            </div>\r\n                            <div class="lastLine">\r\n                                <div class="orderStatus left grey fb">\r\n                                    已完成\r\n                                </div>\r\n                                <div class="right rep-m">\r\n                                    使用代金券<span class="voucher">';
            if (helper = helpers.discount) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.discount;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '</span>元\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                    </a>\r\n                    <div class="btnGroup">\r\n                        <div class="orderTotalPriceBox right">\r\n                            <div class="boxMiddle"><span>合计：</span><span class="orderTotalPrice">&yen ';
            if (helper = helpers.totalPrice) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.totalPrice;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + "</span></div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    ";
            return buffer
        }

        function program8(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n        <!--已评价-->\r\n        <div class="orderList">\r\n            <div class="orderMeLine1">\r\n                <span class="customer left">心有灵犀一点通</span>\r\n                <div class="createTimeBox right"><span>创建时间：</span><span class="createTime">';
            if (helper = helpers.createTime) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.createTime;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '</span></div>\r\n            </div>\r\n            <div class="goodsInfo">\r\n                <a href="/product/goodDetails/goodsDetails.htm?id=';
            if (helper = helpers.productId) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.productId;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '" external>\r\n                    <img class="goodsPic left" src="';
            if (helper = helpers.imgUrl) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.imgUrl;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '">\r\n                </a>\r\n                <div class="rightBox">\r\n                    <a href="/product/goodDetails/goodsDetails.htm?id=';
            if (helper = helpers.productId) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.productId;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '" external>\r\n                        <div class="goodsName">';
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
            buffer += escapeExpression(stack1) + '</div>\r\n                        <div class="priceBox">\r\n                            <div class="goodsPrice">\r\n                                ';
            if (helper = helpers.price) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.price;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '\r\n                                <span class="goodsNumber f5">&Chi;</span>\r\n                                <span class="goodsNumber">';
            if (helper = helpers.amount) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.amount;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '</span>\r\n                            </div>\r\n                            <div class="lastLine">\r\n                                <div class="orderStatus left grey fb">\r\n                                    已完成\r\n                                </div>\r\n                                <div class="right rep-m">\r\n                                    使用代金券<span class="voucher">';
            if (helper = helpers.discount) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.discount;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '</span>元\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                    </a>\r\n                    <div class="btnGroup">\r\n                        <div class="orderTotalPriceBox right">\r\n                            <div class="boxMiddle"><span>合计：</span><span class="orderTotalPrice">&yen ';
            if (helper = helpers.totalPrice) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.totalPrice;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + "</span></div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    ";
            return buffer
        }
        stack1 = helpers.each.call(depth0, depth0, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1
        }
        buffer += "\r\n\r\n";
        return buffer
    })
});
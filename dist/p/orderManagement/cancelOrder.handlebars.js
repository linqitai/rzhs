define("xg/jx-business/1.0.0/p/orderManagement/cancelOrder.handlebars",["alinw/handlebars/1.3.0/runtime"],function(require,exports,module){var Handlebars=require("alinw/handlebars/1.3.0/runtime"),template=Handlebars.template;module.exports=template(function(Handlebars,depth0,helpers,partials,data){function program1(depth0,data){var stack1,helper,buffer="";return buffer+='\r\n    <div class="orderList">\r\n        <div class="storeName">店铺名称',(helper=helpers.storeName)?stack1=helper.call(depth0,{hash:{},data:data}):(helper=depth0&&depth0.storeName,stack1=typeof helper===functionType?helper.call(depth0,{hash:{},data:data}):helper),buffer+=escapeExpression(stack1)+'</div>\r\n        <div class="goodsInfoItem">\r\n            <a href="/product/goodDetails/goodsDetails.htm?id=',(helper=helpers.productId)?stack1=helper.call(depth0,{hash:{},data:data}):(helper=depth0&&depth0.productId,stack1=typeof helper===functionType?helper.call(depth0,{hash:{},data:data}):helper),buffer+=escapeExpression(stack1)+'" external>\r\n                <img class="goodsPic left" src="',(helper=helpers.imgUrl)?stack1=helper.call(depth0,{hash:{},data:data}):(helper=depth0&&depth0.imgUrl,stack1=typeof helper===functionType?helper.call(depth0,{hash:{},data:data}):helper),buffer+=escapeExpression(stack1)+'">\r\n            </a>\r\n            <div class="rightBox">\r\n                <a href="/product/goodDetails/goodsDetails.htm?id=',(helper=helpers.productId)?stack1=helper.call(depth0,{hash:{},data:data}):(helper=depth0&&depth0.productId,stack1=typeof helper===functionType?helper.call(depth0,{hash:{},data:data}):helper),buffer+=escapeExpression(stack1)+'" class="goodsInfo" external>\r\n                    <div class="goodsName">',(helper=helpers.name)?stack1=helper.call(depth0,{hash:{},data:data}):(helper=depth0&&depth0.name,stack1=typeof helper===functionType?helper.call(depth0,{hash:{},data:data}):helper),buffer+=escapeExpression(stack1)+'</div>\r\n                    <div class="priceBox right">\r\n                        <div class="goodsPrice">&yen ',(helper=helpers.price)?stack1=helper.call(depth0,{hash:{},data:data}):(helper=depth0&&depth0.price,stack1=typeof helper===functionType?helper.call(depth0,{hash:{},data:data}):helper),buffer+=escapeExpression(stack1)+'</div>\r\n                        <div class="voucherBox">使用代金券<span class="voucher">',(helper=helpers.discount)?stack1=helper.call(depth0,{hash:{},data:data}):(helper=depth0&&depth0.discount,stack1=typeof helper===functionType?helper.call(depth0,{hash:{},data:data}):helper),buffer+=escapeExpression(stack1)+'</span>元</div>\r\n                    </div>\r\n                </a>\r\n                <div class="btnGroup">\r\n                    次订单已取消\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n'}this.compilerInfo=[4,">= 1.0.0"],helpers=this.merge(helpers,Handlebars.helpers),data=data||{};var stack1,buffer="",functionType="function",escapeExpression=this.escapeExpression,self=this;return stack1=helpers.each.call(depth0,depth0,{hash:{},inverse:self.noop,fn:self.program(1,program1,data),data:data}),(stack1||0===stack1)&&(buffer+=stack1),buffer+="\r\n\r\n"})});
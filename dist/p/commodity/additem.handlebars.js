define("xg/jx-business/1.0.0/p/commodity/additem.handlebars",["alinw/handlebars/1.3.0/runtime"],function(require,exports,module){var Handlebars=require("alinw/handlebars/1.3.0/runtime"),template=Handlebars.template;module.exports=template(function(Handlebars,depth0,helpers,partials,data){function program1(depth0,data){var stack1,buffer="";return buffer+="\r\n        ",stack1=helpers.each.call(depth0,depth0,{hash:{},inverse:self.noop,fn:self.program(2,program2,data),data:data}),(stack1||0===stack1)&&(buffer+=stack1),buffer+="\r\n    "}function program2(depth0,data){var stack1,helper,buffer="";return buffer+='\r\n        <li>\r\n            <div class="leftmore">\r\n                <i class="icon icon-reduce"></i>\r\n            </div>\r\n            <div class="rightmore">\r\n                <input type="text" placeholder="请输入商品规格" class="morename" value="',(helper=helpers.spec)?stack1=helper.call(depth0,{hash:{},data:data}):(helper=depth0&&depth0.spec,stack1=typeof helper===functionType?helper.call(depth0,{hash:{},data:data}):helper),buffer+=escapeExpression(stack1)+'">\r\n                <div>\r\n                    <input type="text" placeholder="原价" class="oneprice" value="',(helper=helpers.primePrice)?stack1=helper.call(depth0,{hash:{},data:data}):(helper=depth0&&depth0.primePrice,stack1=typeof helper===functionType?helper.call(depth0,{hash:{},data:data}):helper),buffer+=escapeExpression(stack1)+'">\r\n                    <input type="text" placeholder="现价" class="twoprice" value="',(helper=helpers.currentPrice)?stack1=helper.call(depth0,{hash:{},data:data}):(helper=depth0&&depth0.currentPrice,stack1=typeof helper===functionType?helper.call(depth0,{hash:{},data:data}):helper),buffer+=escapeExpression(stack1)+'">\r\n                    <input type="text" placeholder="返佣" class="threeprice" value="',(helper=helpers.backPrice)?stack1=helper.call(depth0,{hash:{},data:data}):(helper=depth0&&depth0.backPrice,stack1=typeof helper===functionType?helper.call(depth0,{hash:{},data:data}):helper),buffer+=escapeExpression(stack1)+'">\r\n                </div>\r\n            </div>\r\n            <div class="right-silde">\r\n                删除\r\n            </div>\r\n        </li>\r\n        '}function program4(depth0,data){return'\r\n    <li>\r\n        <div class="leftmore">\r\n            <i class="icon icon-reduce"></i>\r\n        </div>\r\n        <div class="rightmore">\r\n            <input type="text" placeholder="请输入商品规格" class="morename">\r\n            <div>\r\n                <input type="text" placeholder="原价" class="oneprice">\r\n                <input type="text" placeholder="现价" class="twoprice">\r\n                <input type="text" placeholder="返佣" class="threeprice">\r\n            </div>\r\n        </div>\r\n        <div class="right-silde">\r\n            删除\r\n        </div>\r\n    </li>\r\n    '}this.compilerInfo=[4,">= 1.0.0"],helpers=this.merge(helpers,Handlebars.helpers),data=data||{};var stack1,buffer="",functionType="function",escapeExpression=this.escapeExpression,self=this;return stack1=helpers["if"].call(depth0,depth0,{hash:{},inverse:self.program(4,program4,data),fn:self.program(1,program1,data),data:data}),(stack1||0===stack1)&&(buffer+=stack1),buffer+="\r\n"})});
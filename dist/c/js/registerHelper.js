define("xg/jx-business/1.0.0/c/js/registerHelper",["alinw/handlebars/1.3.0/runtime"],function(require,exports,module){var Handlebars=require("alinw/handlebars/1.3.0/runtime");Handlebars.registerHelper("ifCond",function(v1,operator,v2,options){switch(operator){case"!=":return v1!=v2?options.fn(this):options.inverse(this);case"==":return v1==v2?options.fn(this):options.inverse(this);case"===":return v1===v2?options.fn(this):options.inverse(this);case"<":return v1<v2?options.fn(this):options.inverse(this);case"<=":return v1<=v2?options.fn(this):options.inverse(this);case">":return v1>v2?options.fn(this):options.inverse(this);case">=":return v1>=v2?options.fn(this):options.inverse(this);case"&&":return v1&&v2?options.fn(this):options.inverse(this);case"||":return v1||v2?options.fn(this):options.inverse(this);default:return options.inverse(this)}}),Handlebars.compilePlus=function(source,context,options){var template,html="";return"object"!=typeof context?html:(Handlebars.compile&&"string"==typeof source?(template=Handlebars.compile(source),html=template(context,options)):html=source(context,options),html)},Handlebars.registerHelper("addOne",function(index){return index+1}),Handlebars.registerHelper("addTwo",function(index){return index+2}),Handlebars.registerHelper("if_even",function(value,options){return value%2==0?options.fn(this):options.inverse(this)})});
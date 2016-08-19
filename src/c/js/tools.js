define(function(require, exports, module){
    require("deferred");
    require("callbacks");
    module.exports = { 
        //url参数查询       
        GetQueryString: function(name) {
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if(r!=null)return  unescape(r[2]); return null;
        },
        GetRequest: function() {     
            var url = location.search; //获取url中"?"符后的字串
            var theRequest = new Object();
            if (url.indexOf("?") != -1) {
              var str = url.substr(1);
              strs = str.split("&");
              for(var i = 0; i < strs.length; i ++) {
                 theRequest[strs[i].split("=")[0]]=decodeURI(strs[i].split("=")[1]);
              }
            }
            return theRequest;
        },
        //数组去重
        arrayUnique: function(arr) {
            var n = {}, r=[]; //n为hash表，r为临时数组
            for(var i = 0; i < arr.length; i++) //遍历当前数组
            {
                if (!n[arr[i]]) //如果hash表中没有当前项
                {
                    n[arr[i]] = true; //存入hash表
                    r.push(arr[i]); //把当前数组的当前项push到临时数组里面
                }
            }
            return r; 
        },
        //函数节流       
        throttle: function(fn, delay, immediate, debounce) {         
           var curr = +new Date(),//当前事件
               last_call = 0,
               last_exec = 0,
               timer = null,
               diff, //时间差
               context,//上下文
               args,
               exec = function () {
                   last_exec = curr;
                   fn.apply(context, args);
               };
           return function () {
               curr= +new Date();
               context = this,
               args = arguments,
               diff = curr - (debounce ? last_call : last_exec) - delay;
               clearTimeout(timer);
               if (debounce) {
                   if (immediate) {
                       timer = setTimeout(exec, delay);
                   } else if (diff >= 0) {
                       exec();
                   }
               } else {
                   if (diff >= 0) {
                       exec();
                   } else if (immediate) {
                       timer = setTimeout(exec, -diff);
                   }
               }
               last_call = curr;
           }
        },    
        //函数去抖
        debounce: function(fn, delay, immediate) {
            return module.exports.throttle(fn, delay, immediate, true);
        },
        //数组查位
        searchNumber:function (array,findNumber) {
            var defer = $.Deferred();
            for(var i =0 ;i<array.length;i++){
                if(array[i] == findNumber){
                    defer.resolve(true);
                    return i;
                }
            }
            return defer.promise();
        }
    };
});
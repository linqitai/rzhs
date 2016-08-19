define(function(require, exports, module){
	var tools = require("tools");
	var $ = require("$");
		require("cookie");
    module.exports = {
        init:function(){
			var debugIp = tools.GetQueryString("debugIp");
			var debugVersion = tools.GetQueryString("debugVersion");
			if(debugIp){
				$.fn.cookie("debugIp", decodeURIComponent(debugIp), {
					path: "/"
				});
			}
			if(debugVersion){
				$.fn.cookie("debugVersion", decodeURIComponent(debugVersion), {
					path: "/"
				});
			}
		    if(window.navigator.userAgent.match(/micromessenger/gi)){ 
		      document.getElementsByTagName('header')[0].style.display = "none";
		      document.getElementsByClassName('content')[0].style.top = 0;
		      //document.getElementsByClassName('down-tip')[0].style.top = 0;		      
		      //$("header").hide();
		      //$(".bar-nav ~ .content").css("top", 0);
		    }else{
		    	// document.getElementsByClassName('down-tip')[0].style.top = "2.18rem";
		    }
			

        }
    };
    module.exports.init();
});
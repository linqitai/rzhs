define(function(require, exports, module){
    var $ = require("$");
    require("touch");
    require("sm");
    // require("swiper");
    
    var attachFastClick = require("fastclick");
    require('../../c/js/registerHelper.js');
    var Tools = require("tools");
    var tmp1 = require('./goodsList.handlebars');

    module.exports = {
        init: function() {
            var self = this;
            //解决点透事件 
            attachFastClick(document.body);

            //当前第几页，一页有都少条
            self.pageSearchIndex = 1;
            self.pageSearchSize = 6;

            var urlObj = Tools.GetRequest();
            self.name = urlObj["name"];           

            //搜索结果
            var obj = {
                "pageIndex": self.pageSearchIndex,
                "pageSize": self.pageSearchSize,                            
                "status": 1,
                "name": self.name
            };
            self.searchAjax(obj);                                     
        }, 
        infiniteEvtSearch: function(){
            var self = this;
            //标志位
            self.loadingShow = 0;           
            $("#search .content").on('scroll', function(){  
                //判断窗体高度与竖向滚动位移大小相加 是否 超过内容页高度                
                if (($(window).height() + $('.content').scrollTop()) >= $(".content-inner").height()-200) {                    
                    //完成一次loading才能开始下一次loading，防止重复多次
                    if(self.loadingShow == 0) {
                        //标志位设为1当前不能加载
                        self.loadingShow = 1;
                        //当前标签下通过属性取出来的页数+1
                        self.pageSearchIndex = parseInt($("#J_search_result").attr("data-page"))+1;
                        //加载符显示
                        $(".J_loading").show();                                           

                        setTimeout(function() {
                            //搜索结果
                            var obj = {
                                "pageIndex": self.pageSearchIndex,
                                "pageSize": self.pageSearchSize,                              
                                "status": 1,
                                "name": "运动"
                            };
                            self.searchAjax(obj); 
                        },'200');
                    }                  
                }
            });      
        },        
        searchAjax: function(obj) {         
            var self = this;            
            $.ajax({             
                  type: 'post',
                  data: obj,              
                  cache: false,
                  url: '/product/queryProductList',
                  success: function(data) {
                    if(data.result == "ok") {                        
                        if(data.data.length > 0) {
                            //外层显示
                            $("#search .goods-info").show();
                            //加载符号隐藏
                            $("#search .J_loading").hide();
                            //标志位归零
                            self.loadingShow = 0;
                            //将当前第几页放到当前标签的属性里面         
                            $("#J_search_result").attr("data-page", self.pageSearchIndex);
                            $("#search .search-no-data").hide();
                          
                            $("#J_search_result").append(tmp1(data.data));
                        } else {
                            //外层显示
                            $("#search .goods-info").show();
                            if($("#J_search_result").attr("data-page") == "1") {
                                //暂无数据显示                          
                                $("#search .search-no-data").show();
                            } else {
                                //已经加载全部
                                $(".search-no-data-2").html('已经加载全部').show();
                                //加载符移除
                                $("#search .J_loading").remove();
                            }               
                        }
                    } else {
                        $.alert("<div class='error-tip'>"+data.msg+"</div>",'提示');
                    }
                  },
                  complete: function(){
                        //无限滚动
                        self.infiniteEvtSearch();
                  }
            });                              
        }        
    };   
    module.exports.init();
});
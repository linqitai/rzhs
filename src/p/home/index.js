define(function(require, exports, module){
    var $ = require("$");
    require("touch");
    require("sm");
    // require("sm-extend");
    require("swiper");
    
    var attachFastClick = require('fastclick');
    require('../../c/js/registerHelper.js');
    var Tools = require("tools");
    var tmp4 = require('./bannerList.handlebars');
    var tmp3 = require('./menuList.handlebars');
    var tmp1 = require('./goodsList.handlebars');
    // var tmp2 = require('./searchList.handlebars');
    var tmp5 = require('./searchHistoryList.handlebars');

    module.exports = {
        init: function() {
            var self = this;
            $.showIndicator(); 
            //解决点透事件 
            attachFastClick(document.body);
               
            //banner轮播
            self.bannerAjax();   

            //当前第几页，一页有都少条
            self.pageIndex = 1;
            self.pageSize = 10;
            //默认是第一个标签
            self.tabIndex = 0;
            self.pageSearchIndex = 1;
            self.pageSearchSize = 10;

            //读取标签及切换
            self.tabAjax();         

            //下拉刷新
            self.refreshEvt();          

            // self.historyDomArr = [];
            //历史记录
            self.searchInit();                      
        },  
        bannerAjax: function() {
            var self = this;
            $.ajax({             
                  type: 'post',
                  cache: false,
                  url: '/hotSell/query',
                  success: function(data) {
                    //将json字符串转换为json对象
                    var data = JSON.parse(data);
                    if(data.result == "ok") {
                        if(data.data.length > 0) {
                            $("#J_banner").html(tmp4(data.data));
                            //banner切换
                            self.swiperEvt();                             
                        } 
                    } else {
                        $.alert("<div class='error-tip'>"+data.msg+"</div>",'提示');
                    }
                  }
            });
        },
        swiperEvt: function() {
            var self = this;
            var swiper = new Swiper('#J_banner', {
                autoplay: 2500,
                pagination: '.swiper-pagination',
                paginationClickable: true,             
                spaceBetween: 0,
                centeredSlides: true,
                slidesPerView: 1,
                loop: true,
                autoplayDisableOnInteraction: false
            });       
            // var config = {
            // autoplay: 2500,
            //     pagination: '.swiper-pagination',
            //     paginationClickable: true,
            //     spaceBetween: 0,
            //     centeredSlides: true,//设定为true时，活动块会居中，而不是默认状态下的居左。
            //     slidesPerView: 1,
            //     loop: true,
            //     autoplayDisableOnInteraction: false //用户操作swiper之后，是否禁止autoplay。默认为true：停止。
            //                                         //如果设置为false，用户操作swiper之后自动切换不会停止，每次都会重新启动autoplay。
            //                                         //操作包括触碰，拖动，点击pagination等。
            // };
            // $("#J_banner").swiper(config);
        },
        menuScroll: function() {
            var self = this;
            var swiper = new Swiper('#J_menu', {
                centeredSlides: false,
                slidesPerView: 4
            });              
            // var config = {
            //     spaceBetween: 0,
            //     centeredSlides: false,//设定为true时，活动块会居中，而不是默认状态下的居左。
            //     slidesPerView: 4,
            // };
            // $("#J_menu").swiper(config);
        },       
        refreshEvt: function() {
            var self = this;
            //初始化下拉刷新
            $.initPullToRefresh('.pull-to-refresh-content');
            $(document).on('refresh', '.pull-to-refresh-content', function(e) {
                // 模拟1s的加载过程
                setTimeout(function() {                  
                    window.location.reload();
                    // 加载完毕需要重置
                    $.pullToRefreshDone('.pull-to-refresh-content');
                }, 1000);
            });
        },
        infiniteEvt: function() {
            var self = this;
            //标志位
            self.loadingShow = 0;           
            $("#index .content").on('scroll',function() {
                // if($(".content").scrollTop() > 320) {                    
                //     console.log($(".content").scrollTop());
                //     $("#J_banner_wraper").hide();
                //     $("#J_menu_wrap").addClass("fix");
                // } else {
                //     $("#J_banner_wraper").show();
                //     $("#J_menu_wrap").removeClass("fix");
                // }   

                // console.log($(window).height() + $('.content').scrollTop());
                // console.log($(".content-inner").height()-200);

                //判断窗体高度与竖向滚动位移大小相加 是否 超过内容页高度                
                if (($(window).height() + $('#index .content').scrollTop()) >= $(" #index .content-inner").height()-200) {                    
                    //完成一次loading才能开始下一次loading，防止重复多次
                    if(self.loadingShow == 0) {
                        //标志位设为1当前不能加载
                        self.loadingShow = 1;
                        //当前标签下通过属性取出来的页数+1
                        self.pageIndex = parseInt($(".goods-li").eq(self.tabIndex).attr("data-page"))+1;
                        //加载符显示
                        $(self.dom).parent(".goods-info").find(".infinite-scroll-preloader").show();                       

                        // setTimeout(function() {
                            if(self.tabIndex == 0){
                                var obj = {
                                    "pageIndex": self.pageIndex,
                                    "pageSize": self.pageSize,                               
                                    "status": 1                                                         
                                };
                            } else {
                                var obj = {
                                    "pageIndex": self.pageIndex,
                                    "pageSize": self.pageSize,
                                    "catalogId": self.type,
                                    "status": 1                                                          
                                };
                            }                        
                            self.goodsList(obj, self.dom);
                        // },'200');
                    }                   
                }


            });       
        },        
        tabAjax: function() {
            var self = this;
            $.ajax({             
                  type: 'post',
                  cache: false,
                  url: '/catalog/getAllCatalog',
                  success: function(data) {
                    if(data.result == "ok") {
                        if(data.data.length > 0) {
                            $("#J_menu_wrap").html(tmp3(data.data)); 
                            //默认加载第一个标签下的商品
                            var obj = {
                                "pageIndex": self.pageIndex,
                                "pageSize": self.pageSize,
                                "status": 1                                                         
                            };
                            self.dom = $("#J_goods_list .goods-info").eq(0).find(".goods-info-list");
                            // self.dom = $(".goods-info-list").eq(0);
                            self.goodsList(obj, self.dom);          
                            $(".tab-link").eq(0).attr("data-page", "1");                          
                        } 
                    } else {
                        $.alert("<div class='error-tip'>"+data.error+"</div>",'提示');
                    }
                  },
                  complete: function() {
                     //tab切换   
                     self.tabChange();
                     //menu左右滑动
                     self.menuScroll();
                  }
            }); 
        },
        tabChange: function() {
            var self = this; 
            $(".goods-li").live("click",function(e){
                $(this).addClass("active").siblings().removeClass("active");
                self.tabIndex = $(this).index();             
                self.type = $(this).attr("data-id");
                self.dom = $("#J_goods_list .goods-info").eq(self.tabIndex).find(".goods-info-list");
                // self.dom = $(".goods-info-list").eq(self.tabIndex);
                $("#J_goods_list .goods-info").eq(self.tabIndex).show().siblings().hide();

                //只有第一次切换到该标签才会去发请求
                if(!$(this).attr("data-page")) {
                    $(this).attr("data-page", "1");                 
                    var obj = {
                        pageIndex: self.pageIndex,
                        pageSize: self.pageSize,
                        catalogId: self.type,
                        "status": 1
                    };
                    self.goodsList(obj, self.dom);
                }
            }); 
        },       
        goodsList: function(obj, dom) {       
            var self = this;                       
            $.ajax({             
                  type: 'post',
                  data: obj,              
                  cache: false,
                  url: '/product/queryProductList',
                  success: function(data) {
                    if(data.result == "ok") {
                        if(data.data.length > 0) {
                            $.hideIndicator();                                                 
                            //加载符号隐藏
                            $(dom).parent(".goods-info").find(".J_loading").hide();
                            //标志位归零
                            self.loadingShow = 0;
                            //将当前第几页放到当前标签的属性里面         
                            $(".goods-li").eq(self.tabIndex).attr("data-page", self.pageIndex);
                            $(dom).parent(".goods-info").find(".search-no-data").hide();
                          
                            $(dom).append(tmp1(data.data));
                        } else { 
                            //如果是第一页加载的没有数据提示，其他页数没有加载数据表示已经加载完成
                            if($(".goods-li").eq(self.tabIndex).attr("data-page") == "1") {
                                //暂无数据显示    
                                $(dom).parent(".goods-info").find(".search-no-data").show();
                            } else {
                                //已经加载全部
                                $(dom).parent(".goods-info").find(".search-no-data-2").html('已经加载全部').show();
                                //加载符移除
                                $(dom).parent(".goods-info").find(".J_loading").remove();
                            }                
                        }
                    } else {
                        $.alert("<div class='error-tip'>"+data.msg+"</div>",'提示');
                    }
                  },
                  complete: function(){
                    //无限滚动
                    self.infiniteEvt();
                  }
            });                               
        },  
        searchInit: function() {
            var self = this;
            $(document).on("pageInit", function(e, pageId, $page) {
                //如果当前页面是搜索页面
                if(pageId == "search") {
                    $("#J_search_input").val("");
                    $("#J_clean_img").hide();
                    $("#J_search_btn").removeClass("active");

                    //读取历史记录
                    self.searchHistoryAjax();
                    //清除历史记录
                    self.searchCleanLog();
                    //增加历史记录
                    self.searchAdd();
                    self.historyAdd();
                    //搜索
                    // self.searchEvt();     
                    //搜索框相关样式切换  
                    self.searchCleanInput();                   

                    /*var str = '', arr = [];
                    if(sessionStorage.getItem("history") != null) {
                        str = sessionStorage.getItem("history");
                        arr = str.split(",");
                        arr = Tools.arrayUnique(arr);
                        str = arr.join("");

                        $(".history-tip").show();
                        $(".search-data").show();
                        $("#search .search-no-data").hide();

                        $("#J_search_list").html(str);
                        $("#J_search_list .history_link").on("click",function() {
                            var str = '<li data='+$(this).attr("data")+' class="history_link bb">'+$(this).html()+'</li>'+','+sessionStorage.history;
                            sessionStorage.setItem("history",str);
                            // window.location.href = "/m/manage/house/houseResource/view.htm?id="+$(this).attr("data");
                            sessionStorage.setItem("plotId", $(this).attr("data"));
                        });
                    } else {
                        $(".search-data").hide();
                        $("#search .search-no-data").show();
                    }*/
                }
            });
        },
        //点击搜索按钮，将内容加入历史数据
        searchAdd: function() {
            var self = this;
            $("#J_search_btn").on("click", function(){
                self.name = $("#J_search_input").val();
                self.searchAddAjax();
            });
        },
        //点击历史记录的某条数据会重新添加到数据库
        historyAdd: function(){
            var self = this;
            $(".history_link").live("click", function(){
                self.name = $(this).html();
                self.searchAddAjax();
            });
        },
        searchAddAjax: function(tag) {
            var self = this;
            $.ajax({             
                type: 'post',
                data: {
                    detail: self.name
                },              
                cache: false,
                url: '/SearchHistory/insert',
                success: function(data) {
                    var data = JSON.parse(data);
                    if(data.result == "ok") {  
                        if(!tag) {
                            window.location.href = encodeURI("/home/search?name="+self.name);                            
                        } else {
                            //重读历史记录
                            self.searchHistoryAjax();
                        }      
                    }
                }
            });
        },
        searchHistoryAjax: function() {
            var self = this;
            $.ajax({             
                type: 'post',
                data: {
                    userId: 110,
                },              
                cache: false,
                url: '/SearchHistory/query',
                success: function(data) {
                    var data = JSON.parse(data);
                    if(data.result == "ok") {                        
                        if(data.data.length > 0) {                             
                            $(".goods-list-3").hide();
                            $(".history-wraper").show();
                            $("#J_no_search_result").hide();
                            $("#J_search_list").html(tmp5(data.data));                            
                        } else {
                            $(".history-wraper").hide();
                            $("#J_no_search_result").show();
                        }
                    }
                }
            });
        },
        searchCleanInput: function() {
            var self = this;
            $('#J_search_input').on("keyup", function(event){
                if(!$('#J_search_input').val()){
                    $("#J_clean_img").hide();
                    $("#J_search_btn").removeClass("active");
                }else{
                    $("#J_clean_img").show();
                    $("#J_search_btn").addClass("active");
                }
            });
            $("#J_clean_img").on("click",function(){
                $("#J_search_input").val("");
                $("#J_search_btn").removeClass("active");
                $("#J_clean_img").hide();
                //重新去读历史记录
                self.searchHistoryAjax();
            });
        },
        searchCleanLog: function() {
            var self = this;
            $("#J_clean_txt").live("click", function(){ 
                $.ajax({             
                    type: 'post',                              
                    cache: false,
                    url: '/SearchHistory/del',
                    success: function(data) {
                        var data = JSON.parse(data);
                        if(data.result == "ok") {  
                            //删除成功，重新读一下                      
                            self.searchHistoryAjax();
                        }
                    }
                });
            });
        }
        // infiniteEvtSearch: function(){
        //     var self = this;
        //     //标志位
        //     self.loadingSearchShow = 0;                    
        //     $("#search .content").on('scroll', function(){  
        //         //判断窗体高度与竖向滚动位移大小相加 是否 超过内容页高度                
        //         if (($(window).height() + $('#search .content').scrollTop()) >= $("#search .content-inner").height()-200) {  
        //              //完成一次loading才能开始下一次loading，防止重复多次
        //             if(self.loadingSearchShow == 0) {
        //                 //标志位设为1当前不能加载
        //                 self.loadingSearchShow = 1;
        //                 //当前页数+1
        //                 self.pageSearchIndex = self.pageSearchIndex+1;
        //                 //加载符显示
        //                 $("#search .J_loading").show();                                           

        //                 setTimeout(function() {
        //                     //搜索结果
        //                     var obj = {
        //                         "pageIndex": self.pageSearchIndex,
        //                         "pageSize": self.pageSearchSize,                              
        //                         "status": 1,
        //                         "name": "运动"
        //                     };
        //                     self.searchAjax(obj, true); 
        //                 },'200');
        //             }                   
        //         } 
        //     });      
        // },
        // searchEvt: function() {
        //     var self = this;
        //     $("#J_search_btn").live("click", function(){
        //         self.pageSearchIndex = 1;
        //         var obj = {
        //             "pageIndex": self.pageSearchIndex,
        //             "pageSize": self.pageSearchSize,                              
        //             "status": 1,
        //             "name": $("#J_search_input").val()
        //         };                
        //         self.searchAjax(obj); 
        //     });
        // },
        // searchAjax: function(obj, tag) {         
        //     var self = this; 
        //     $.ajax({             
        //           type: 'post',
        //           data: obj,              
        //           cache: false,
        //           url: '/product/queryProductList',
        //           success: function(data) {
        //             if(data.result == "ok") { 
        //                 //搜索历史外框隐藏
        //                 $(".history-wraper").hide();
        //                 //搜索结果外框显示
        //                 $(".goods-list-3").show();    

        //                 if(data.data.length > 0) { 
        //                     //加载符号隐藏
        //                     $("#search .J_loading").hide();
        //                     //标志位归零
        //                     self.loadingSearchShow = 0;                           
        //                     //暂无数据隐藏
        //                     $("#J_no_search_result").hide();

        //                     if(!tag) {
        //                         $("#J_search_result").html(tmp1(data.data));                                
        //                     } else {
        //                         $("#J_search_result").append(tmp1(data.data));
        //                     }

        //                 } else {    
        //                     if(!tag) {                                      
        //                         $(".goods-list-3").hide();
        //                         //暂无数据显示                    
        //                         $("#J_no_search_result").show();
        //                     } else {
        //                         //已经加载全部
        //                         $(".search-no-data-2").html('已经加载全部').show();
        //                         //加载符移除
        //                         $("#search .J_loading").remove();
        //                     }                
        //                 }
        //             } else {
        //                 $.alert("<div class='error-tip'>"+data.msg+"</div>",'提示');
        //             }
        //           },
        //           complete: function(){
        //                 //无限滚动
        //                 self.infiniteEvtSearch();
        //           }
        //     });                                         
        // }      
    };   
    module.exports.init();
});
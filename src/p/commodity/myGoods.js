/**
 * Created by pk111 on 2016/8/1.
 */
define(function(require, exports, module){
    var $ = require("$");
    require("touch");
    require("deferred");
    require("callbacks");
    require("sm");
    require("sm-extend");
    require("fastclick");
    require("fx");
    var tools =require("tools");
    var IScroll = require("iscroll");
    var goodstemp = require("./goodsMng.handlebars");
    var pageInfo = [{page:1,size:8,over:0},{page:1,size:8,over:0},{page:1,size:8,over:0}];//记录tab和页数
    var looping = false;//记录是否有一个无限滚动正在进行
    module.exports = {
        init:function () {
            var self = this;
            $.showIndicator();
            self.ajaxforlist(1).then(self.ajaxforlist(2)).then(self.ajaxforlist(3));//加载
            self.loado();//无限滚动
            self.scollandup();
            // var myScroll = new IScroll('#listview1',{
            //     scrollbars: true
            // });
        },
        //加载数据函数
        ajaxforlist:function (tabNumber) {
            var self = this;
            var defer = $.Deferred();
            var section,plad={};
            if(tabNumber === 1){
                section = "#listview1";
            }else if(tabNumber === 2){
                section = "#listview2";
                plad.status=1;
            }else if(tabNumber === 3){
                section = "#listview3";
                plad.status=0;
            }
            plad.pageIndex = pageInfo[tabNumber-1].page;
            plad.pageSize = pageInfo[tabNumber-1].size;
            plad.type = 1;
            $.ajax({
                type: 'post',
                cache: false,
                url: '/product/queryProductList',
                data: plad,
                success: function(data) {
                    if(data.result=="ok") {
                        if(data.data.length>0){
                            $("#tab" + tabNumber + " .infinite-scroll-preloader").hide();
                            for(var i=0;i<data.data.length;i++){
                                if(data.data[i].status=="1"){
                                    data.data[i].status=1;
                                }else{
                                    data.data[i].status=0;
                                }
                            }
                            self.intohtml(section,data.data);
                            looping = false;
                            pageInfo[tabNumber-1].page =pageInfo[tabNumber-1].page+1;
                        }else{
                            if(pageInfo[tabNumber-1].page===1){
                                var ckmiss="<div class='missing'><img src='http://static.hpbanking.com/xg/uploads/files/6c038b5768301c51fc839c06f93cc4e7-120-120.png'><div>暂无记录</div> </div>";
                                $(section).html(ckmiss);
                            }else{
                                $(section).append("<div class='search-no-data-2'>已经加载全部</div>");
                                $("#tab" + tabNumber + " .infinite-scroll-preloader").hide();
                            }
                            looping = false;
                            pageInfo[tabNumber-1].over =1;
                        }
                        defer.resolve(true);
                    }else{
                        $.alert("<div class='error-tip'>"+"加载出错"+"</div>",'提示');
                    }
                }
            });
            return defer.promise();
        },
        //into 函数用于添加内容进入模板
        intohtml:function (section,htmldata) {
            var self = this;
            var pasthtml = $(section).html();
            if(pasthtml==""){
                $(section).html(goodstemp(htmldata));
            }else{
                $(section).append(goodstemp(htmldata));
            }
            $.hideIndicator();
            self.clickeve();//页面加载后重新绑定点击事件
        },
        //下滑事件的监听和判断
        loado:function () {
            var self = this;
            $(".content").on('scroll',function() {
                var tabNumber;
                //当内容滚动到底部时加载新的内容 100当距离最底部100个像素时开始加载.
                // if ( $('.content-block').height() - ($('.content').scrollTop() + $(".content").height())  < 400) {
                if(($(window).height() + $('.content').scrollTop()) >= $(".content-block").height()-200){
                    if (looping == false) {

                        tabNumber = tabindex('tab');
                        if(!pageInfo[tabNumber-1].over){
                            $("#tab" + tabNumber + " .infinite-scroll-preloader").show();
                            looping = true;
                            self.ajaxforlist(tabNumber);
                        }
                    }
                }
            });
        },
        clickeve : function () {
            var self = this;
            $(document).unbind('click',".upgoods").on('click',".upgoods",function (e) {
                $.confirm('确认要上架这个宝贝吗?',
                    function () {
                        self.changeUporNext($(e.target).data("goodid"),1);
                    },
                    function () {}
                );
            }).unbind('click',".editgoods").on('click','.editgoods',function (e) {
                window.location.href = "/product/editGoods?goodid="+$(e.target).data("goodid");
            }).unbind('click',".deletegoods").on('click','.deletegoods',function (e) {
                $.confirm('确认要删除这个宝贝吗?',
                    function () {
                        self.deleteGoods($(e.target).data("goodid")).then(function (data) {
                            if(data){
                                $(e.target).parent().parent().css({opacity:0}).css({width:0,height:0});
                                    setTimeout(function () {
                                        $(e.target).parent().parent().remove();
                                    },100);
                                console.log($(e.target).parent().parent().parent().find(".goodsList").length)
                                if($(e.target).parent().parent().parent().find(".goodsList").length==1){
                                    var nowActive=tabindex('tab');
                                    self.ajaxforlist(nowActive);
                                }
                            }
                        })
                        
                    },
                    function () {}
                );
            }).unbind('click',".downgoods").on('click','.downgoods',function (e) {
                $.confirm('确认要下架这个宝贝吗?',
                    function () {
                        self.changeUporNext($(e.target).data("goodid"),0);
                    },
                    function () {}
                );
            }).unbind('click',".addicon").on('click','.addicon',function (e) {
                window.location.href = "/product/myUpload";
            })
        },
        deleteGoods:function (productId) {
            var defobj = $.Deferred();
            $.ajax({
                type: 'post',
                cache: false,
                url: '/product/deleteProduct',
                data: {
                    productId:productId
                },
                success: function(data) {
                    if(data.result === "ok") {
                        defobj.resolve(true);
                    } else {
                        $.alert("<div class='error-tip'>"+data.error+"</div>",'提示');
                        defobj.reject();
                    }
                }
            });
            return defobj.promise();
        },
        changeUporNext:function (productId,UporDown) {
            $.ajax({
                type: 'post',
                cache: false,
                url: '/product/changeStatus',
                data: {
                    productId:productId,
                    status:UporDown
                },
                success: function(data) {
                    if(data.result === "ok") {
                        window.location.reload()
                    } else {
                        $.alert("<div class='error-tip'>"+data.error+"</div>",'提示');
                        return false;
                    }
                }
            });
        },
        scollandup:function () {
            $(window).on("swipeDown",function () {
                if($('.content-block').height()>1930){
                    $(".returnTopm").css("display","block");
                }else{
                    $(".returnTopm").css("display","none");
                }
            });
            $(window).on("swipeUp",function () {
                    $(".returnTopm").css("display","none");
            })
        }

    };
    module.exports.init();
    function tabindex(section) {
        if ($('.'+section+'.active').attr('id') === "tab1") {
            return 1;
        }else if ($('.'+section+'.active').attr('id') === "tab2"){
            return 2;
        }else if ($('.'+section+'.active').attr('id') === "tab3"){
            return 3;
        }
    }
});
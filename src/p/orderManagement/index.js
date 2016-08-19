/**
 * Created by pk111 on 2016/8/1.
 */
define(function(require, exports, module){
    var $ = require("$");
    require("dragloader");
    require("touch");
    require("deferred");
    require("callbacks");
    require("sm");
    require("sm-extend");
    require("fastclick");
    require('../../c/js/registerHelper.js');
    var allOrderTemp = require('./allOrder.handlebars');
    var orderedTemp = require('./ordered.handlebars');
    var discussTemp = require('./discuss.handlebars');
    var notData = require('./notData.handlebars');
    module.exports = {
        init: function () {
            $.showIndicator();
            var self = this;
            self.buyerId = 1;
            self.pageIndex1=1;
            self.loadAll1 = false;
            self.havaScroll1 = false;
            self.pageIndex2=1;
            self.loadAll2 = false;
            self.havaScroll2 = false;
            self.pageIndex3=1;
            self.loadAll3 = false;
            self.havaScroll3 = false;
            self.pageSize=10;
            self.looping = false;//记录是否有一个无限滚动正在进行
            //self.getList();
            self.data1 = {};
            self.data1.buyerId = self.buyerId;
            self.data1.pageIndex = self.pageIndex1;
            self.data1.pageSize = self.pageSize;
            self.getAllOrderList(self.data1);
            //全部订单列表初始化
            /*$($("#tabCut1 .select-tab .buttons-tab .tab-link")[0]).trigger("click");*/
            self.initEvents();
        },
        getAllOrderList:function (params) {
            var self = this;
            if(self.havaScroll1==false){
                $.showIndicator();
            }
            var defer = $.Deferred();
            var allOrder = $("#allOrder");
            self.looping = true;

            $.post("/trade/list.json", params, function(data){
                if(data.result=="ok"){
                    var list = data.data;
                    //console.log(list.length);
                    if(list.length>0){
                        var obj=[];
                        for(var i= 0;i<list.length;i++){
                            if(list[i].name.length>15){
                                list[i].name = list[i].name.substr(0,12)+"...";
                            }
                        }
                        allOrder.append(allOrderTemp(list));
                        self.looping = false;
                    }else{
                        if(self.data1.pageIndex==1){
                            allOrder.append(notData(null));
                        }else if(self.data1.pageIndex>1){
                            //console.log("已经加载全部");
                            if(self.loadAll1==false){
                                allOrder.append("<div class='search-no-data-2'>已经加载全部</div>");
                                self.loadAll1=true;
                            }
                        }
                    }
                    $.hideIndicator();
                }
            });
            return defer.promise();
        },
        getOrderedList:function (params) {
            var self = this;
            if(self.havaScroll2==false){
                $.showIndicator();
            }
            var defer = $.Deferred();
            var ordered = $("#ordered");
            self.looping = true;

            $.post("/trade/list.json", params, function(data){
                if(data.result=="ok"){
                    var list = data.data;
                    //console.log(list.length);
                    if(list.length>0){
                        var obj=[];
                        for(var i= 0;i<list.length;i++){
                            if(list[i].name.length>15){
                                list[i].name = list[i].name.substr(0,12)+"...";
                            }
                        }
                        ordered.append(orderedTemp(list));
                        self.looping = false;
                    }else{
                        if(self.data2.pageIndex==1){
                            ordered.append(notData(null));
                        }else if(self.data2.pageIndex>1){
                            if(self.loadAll2==false){
                                ordered.append("<div class='search-no-data-2'>已经加载全部</div>");
                                self.loadAll2=true;
                            }
                        }
                    }
                    $.hideIndicator();
                }
            });
            return defer.promise();
        },
        getDiscussList:function (params) {
            var self = this;
            if(self.havaScroll3==false){
                $.showIndicator();
            }
            var defer = $.Deferred();
            var discuss = $("#discuss");
            self.looping = true;

            $.post("/trade/list.json", params, function(data){
                if(data.result=="ok"){
                    var list = data.data;
                    if(list.length>0){
                        var obj=[];
                        for(var i= 0;i<list.length;i++){
                            if(list[i].name.length>15){
                                list[i].name = list[i].name.substr(0,12)+"...";
                            }
                        }
                        discuss.append(discussTemp(list));
                        self.looping = false;
                    }else{
                        if(self.data3.pageIndex==1){
                            discuss.append(notData(null));
                        }else if(self.data3.pageIndex>1){
                            if(self.loadAll3==false){
                                discuss.append("<div class='search-no-data-2'>已经加载全部</div>");
                                self.loadAll3=true;
                            }
                        }
                    }
                    $.hideIndicator();
                }
            });
            return defer.promise();
        },
        initEvents: function () {
            var self = this;
            //tabCut1切换事件
            var tabCut1 = $("#tabCut1 .select-tab .buttons-tab .tab-link");
            var allOrder = $("#allOrder");
            var ordered = $("#ordered");
            var discuss = $("#discuss");
            //$(tabCut1[0]).trigger("click");
            //全部按钮点击事件
            $(tabCut1[0]).on("click", function () {
                if(self.pageIndex1==1){
                    if(allOrder.html()==""||allOrder.html()==null){
                        self.data1 = {};
                        self.data1.buyerId = self.buyerId;
                        self.data1.pageIndex = 1;
                        self.data1.pageSize = self.pageSize;
                        self.getAllOrderList(self.data1);
                    }
                }
            });
            //已预约按钮点击事件
            $(tabCut1[1]).on("click", function () {
                if(self.pageIndex2==1){
                    if(ordered.html()==""||ordered.html()==null) {
                        self.data2 = {};
                        self.data2.buyerId = self.buyerId;
                        self.data2.status = 0;
                        self.data2.pageIndex = self.pageIndex2;
                        self.data2.pageSize = self.pageSize;
                        self.getOrderedList(self.data2);
                    }
                }
            });
            //待评价按钮点击事件
            $(tabCut1[2]).on("click", function () {
                if(self.pageIndex3==1){
                    if(discuss.html()==""||discuss.html()==null) {
                        self.data3 = {};
                        self.data3.buyerId = self.buyerId;
                        self.data3.status = 2;
                        self.data3.pageIndex = self.pageIndex3;
                        self.data3.pageSize = self.pageSize;
                        self.getDiscussList(self.data3);
                    }
                }
            });
            //无限滚动
            $(".content").on("scroll",function() {
                if(($(window).height() + $('.content').scrollTop()) >= $(".content-block").height()-200){
                    if (self.looping == false) {
                        function tabindex(section) {
                            if ($('.'+section+'.active').attr('id') === "tab1") {
                                return 1;
                            }else if ($('.'+section+'.active').attr('id') === "tab2"){
                                return 2;
                            }else if ($('.'+section+'.active').attr('id') === "tab3"){
                                return 3;
                            }
                        }
                        var tabNumber = tabindex('tab');
                        $("#tab" + tabNumber + " .infinite-scroll-preloader").show();
                        self.looping = true;
                        if(tabNumber==1){
                            self.havaScroll1 = true;
                            self.pageIndex1 += 1;
                            self.data1.pageIndex = self.pageIndex1;
                            self.getAllOrderList(self.data1);
                        }else if(tabNumber==2){
                            self.havaScroll2 = true;
                            self.pageIndex2 += 1;
                            self.data2.pageIndex = self.pageIndex2;
                            self.getOrderedList(self.data2);
                        }else if(tabNumber==3){
                            self.havaScroll3 = true;
                            self.pageIndex3 += 1;
                            self.data3.pageIndex = self.pageIndex3;
                            self.getDiscussList(self.data3);
                        }
                    }
                }
            });
            $("#tabCut2").hide();
            //最上面的tab切换与页面初始化
            $(".titletype").unbind("click").click(function () {
                var index = $(this).index();
                $(this).addClass("active").siblings(".tabText").removeClass("active");
                if(index==0){
                    $("#tabCut1").show();
                    $("#tabCut2").hide();
                }else if(index==1){
                    $("#tabCut1").hide();
                    $("#tabCut2").show();
                }
            });
            //allOrder中确评价按钮点击事件
            $(document).on('click', '#allOrder .create-discuss-popup',function (e) {
                var id = $(this).attr("data-id");
                var productId = $(this).attr("data-productId");
                //console.log('id:'+ id+",productId:"+productId);
                self.discussId = id;
                self.productId = productId;
                /*$.popup('.popup-discuss');*/
                var popupHTML = '<div class="popup popup-discuss">\
                                    <div class="content-block">\
                                        <div class="jx-pop-title">\
                                            <i class="icon icon-closepop close-popup"></i>\
                                        </div>\
                                        <textarea class="discussContent" placeholder="请输入评论内容......"></textarea>\
                                        <footer class="orange-btn open-about" id="sureDiscussBtn">提交评价</footer>\
                                    </div>\
                                </div>';
                $.popup(popupHTML);
            });
            $(document).on('click', '#sureDiscussBtn',function (e) {
                var id = self.discussId;
                var content = $(".discussContent").val();
                var params = {
                    oid:self.productId,
                    detail:content,
                    tid:self.discussId,
                }
                $.post("/rate/tradeRate", params, function(data){
                    var data = JSON.parse(data);
                    if(data.result=="ok"){
                        $.toast(data.msg);
                        $(".close-popup").trigger("click");
                        location.reload();
                    }else if(data.result=="fail"){
                        $.toast(data.msg);
                    }
                });
            });
            //allOrder中确认收获按钮点击事件
            $(document).on('click', '#allOrder .sureBtn.confirm-ok-cancel',function (e) {
                var id = $(this).attr("data-id");
                $.confirm('您确定要收货吗?',
                    function () {
                        var params = {
                            tradeId:id,
                        }
                        $.post("/trade/confirmReceipt.json", params, function(data){
                            if(data.result=="ok"){
                                $.toast("确认成功");
                                $(e.target).parent().empty().append('<button class="btn btn-default right not-fill discussBtn" data-id="'+id+'">评价</button>');
                            }
                        });
                    },
                    function () {
                        //console.log('You clicked Cancel button');
                    }
                );
                //allOrder中取消订单按钮点击事件
            }).on('click', '#allOrder .cancelBtn.confirm-ok-cancel',function (e) {
                var id = $(this).attr("data-id");
                $.confirm('您确定要取消订单吗?',
                    function () {
                        var params = {
                            tradeId:id,
                        }
                        $.post("/trade/tradeCancel.json", params, function(data){
                            if(data.result=="ok"){
                                $.toast("取消成功");
                                $(e.target).parent().empty().append('<div class="textDescription">此订单已取消</div>');
                            }
                        });
                    },
                    function () {
                        //console.log('You clicked Cancel button');
                    }
                );
                //ordered中取消订单按钮点击事件
            }).on('click', '#ordered .cancelBtn.confirm-ok-cancel',function (e) {
                var id = $(this).attr("data-id");
                $.confirm('您确定要取消订单吗?',
                    function () {
                        var params = {
                            tradeId:id,
                        }
                        $.post("/trade/tradeCancel.json", params, function(data){
                            if(data.result=="ok"){
                                $.toast("取消成功");
                                $(e.target).parent().empty().append('<div class="textDescription">此订单已取消</div>');
                            }
                        });
                    },
                    function () {
                        //console.log('You clicked Cancel button');
                    }
                );
                //discuss中评论按钮点击事件
            }).on('click', '#discuss .discussBtn',function (e) {
                var id = $(this).attr("data-id");
                var productId = $(this).attr("data-productId");
                self.discussId = id;
                self.productId = productId;
                /*$.popup('.popup-discuss');*/
                var popupHTML = '<div class="popup popup-discuss">\
                                    <div class="content-block">\
                                        <div class="jx-pop-title">\
                                            <i class="icon icon-closepop close-popup"></i>\
                                        </div>\
                                        <textarea class="discussContent" placeholder="请输入评论内容......"></textarea>\
                                        <footer class="orange-btn open-about" id="sureDiscussBtn">提交评价</footer>\
                                    </div>\
                                </div>';
                $.popup(popupHTML);

            });

        },
    };
    module.exports.init();
});
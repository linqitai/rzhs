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
    var waitSureTemp = require('./waitSure.handlebars');
    var completedTemp = require('./completed.handlebars');
    var notData = require('./notData.handlebars');
    var looping = false;//记录是否有一个无限滚动正在进行
    module.exports = {
        init: function () {
            $.showIndicator();
            //console.log( $(".page").width());
            var self = this;
            self.buyerId = 1;
            self.pageIndex1 = 1;
            self.loadAll1 = false;
            self.havaScroll1 = false;
            self.pageIndex2 = 1;
            self.loadAll2 = false;
            self.havaScroll2 = false;
            self.pageIndex3 = 1;
            self.loadAll3 = false;
            self.havaScroll3 = false;
            self.pageIndex4 = 1;
            self.loadAll4 = false;
            self.havaScroll4 = false;
            self.pageSize=10;
            self.looping = false;//记录是否有一个无限滚动正在进行
            //self.getList();
            self.data1 = {};
            self.data1.buyerId = self.buyerId;
            self.data1.pageIndex = self.pageIndex1;
            self.data1.pageSize = self.pageSize;
            self.getAllOrderList(self.data1);
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
            //console.log(params);
            $.post("/trade/list.json", params, function(data){
                //console.log(data);
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
            //console.log(params);
            $.post("/trade/list.json", params, function(data){
                //console.log(data);
                if(data.result=="ok"){
                    var list = data.data;
                    //console.log(list.length);
                    if(list.length>0){
                        var obj=[];
                        for(var i= 0;i<list.length;i++){
                            if(list[i].name.length>15){
                                list[i].name = list[i].name.substr(0,12)+"...";
                            }
                            //console.log(list[i].status);
                        }
                        ordered.append(orderedTemp(list));
                        self.looping = false;
                    }else{
                        if(self.data2.pageIndex==1){
                            ordered.append(notData(null));
                        }else if(self.data2.pageIndex>1){
                            //console.log("已经加载全部");
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
        getWaitSureList:function (params) {
            var self = this;
            if(self.havaScroll3==false){
                $.showIndicator();
            }
            var defer = $.Deferred();
            var waitSure = $("#waitSure");
            self.looping = true;
            //console.log(params);
            $.post("/trade/list.json", params, function(data){
                //console.log(data);
                if(data.result=="ok"){
                    var list = data.data;
                    //console.log(list.length);
                    if(list.length>0){
                        var obj=[];
                        for(var i= 0;i<list.length;i++){
                            if(list[i].name.length>15){
                                list[i].name = list[i].name.substr(0,12)+"...";
                            }
                            //console.log(list[i].status);
                        }
                        waitSure.append(waitSureTemp(list));
                        self.looping = false;
                    }else{
                        if(self.data3.pageIndex==1){
                            waitSure.append(notData(null));
                        }else if(self.data3.pageIndex>1){
                            //console.log("已经加载全部");
                            if(self.loadAll3==false){
                                waitSure.append("<div class='search-no-data-2'>已经加载全部</div>");
                                self.loadAll3=true;
                            }
                        }
                    }
                    $.hideIndicator();
                }
            });
            return defer.promise();
        },
        getCompletedList:function (params) {
            var self = this;
            if(self.havaScroll4==false){
                $.showIndicator();
            }
            var defer = $.Deferred();
            var completed = $("#completed");
            self.looping = true;
            //console.log(params);
            $.post("/trade/list.json", params, function(data){
                //console.log(data);
                if(data.result=="ok"){
                    var list = data.data;
                    //console.log(list.length);
                    if(list.length>0){
                        var obj=[];
                        for(var i= 0;i<list.length;i++){
                            if(list[i].name.length>15){
                                list[i].name = list[i].name.substr(0,12)+"...";
                            }
                            //console.log(list[i].status);
                        }
                        completed.append(completedTemp(list));
                        self.looping = false;
                    }else{
                        if(self.data4.pageIndex==1){
                            completed.append(notData(null));
                        }else if(self.data4.pageIndex>1){
                            //console.log("已经加载全部");
                            if(self.loadAll4==false){
                                completed.append("<div class='search-no-data-2'>已经加载全部</div>");
                                self.loadAll4=true;
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
            var tabCut1 = $("#tabCut1 .select-tab .buttons-tab .tab-link");
            var allOrder = $("#allOrder");
            var ordered = $("#ordered");
            var waitSure = $("#waitSure");
            var completed = $("#completed");
            //$(tabCut1[0]).trigger("click");
            //全部按钮点击事件
            $(tabCut1[0]).on("click", function () {
                //console.log(self.pageIndex1);
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
            //预约中按钮点击事件
            $(tabCut1[1]).on("click", function () {
                //console.log("预约中")
                if(self.pageIndex2==1){
                    if(ordered.html()==""||ordered.html()==null) {
                        self.data2 = {};
                        self.data2.buyerId = self.buyerId;
                        self.data2.status = 0;//预约中
                        self.data2.pageIndex = self.pageIndex2;
                        self.data2.pageSize = self.pageSize;
                        self.getOrderedList(self.data2);
                    }
                }
            });
            //待确认按钮点击事件
            $(tabCut1[2]).on("click", function () {
                if(self.pageIndex3==1){
                    if(waitSure.html()==""||waitSure.html()==null) {
                        self.data3 = {};
                        self.data3.buyerId = self.buyerId;
                        self.data3.status = 1;
                        self.data3.pageIndex = self.pageIndex3;
                        self.data3.pageSize = self.pageSize;
                        self.getWaitSureList(self.data3);
                    }
                }
            });
            //已完成按钮点击事件
            $(tabCut1[3]).on("click", function () {
                if(self.pageIndex4==1){
                    if(completed.html()==""||completed.html()==null) {
                        self.data4 = {};
                        self.data4.buyerId = self.buyerId;
                        self.data4.status = 2;
                        self.data4.pageIndex = self.pageIndex4;
                        self.data4.pageSize = self.pageSize;
                        self.getCompletedList(self.data4);
                    }
                }
            });
            //无限滚动
            $(".content").on("scroll",function() {
                //console.log("scroll");
                if(($(window).height() + $('.content').scrollTop()) >= $(".content-block").height()-200){
                    if (self.looping == false) {
                        function tabindex(section) {
                            if ($('.'+section+'.active').attr('id') === "tab1") {
                                return 1;
                            }else if ($('.'+section+'.active').attr('id') === "tab2"){
                                return 2;
                            }else if ($('.'+section+'.active').attr('id') === "tab3"){
                                return 3;
                            }else if ($('.'+section+'.active').attr('id') === "tab4"){
                                return 4;
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
                            self.getWaitSureList(self.data3);
                        }else if(tabNumber==4){
                            self.havaScroll4 = true;
                            self.pageIndex4 += 1;
                            self.data4.pageIndex = self.pageIndex4;
                            self.getCompletedList(self.data4);
                        }
                    }
                }
            });
            $(document).on('click', '#allOrder .sureBtn.confirm-ok-cancel',function (e) {
                var id = $(this).attr("data-id");
                $.confirm('是否确认消费?',
                    function () {
                        //console.log('id:'+ id);
                        var params = {
                            tradeId:id,
                        }
                        $.post("/trade/confirmShipment.json", params, function(data){
                            //console.log(params);
                            //console.log(data);
                            if(data.result=="ok"){
                                $.toast("确认消费成功");
                                $(e.target).prev().removeClass("left").addClass("right");
                                $(e.target).parent().parent().find(".orderStatus").html("等待买家确认");
                                $(e.target).remove();
                            }
                        });
                    },
                    function () {
                        //console.log('You clicked Cancel button');
                    }
                );
                //allOrder中取消订单按钮点击事件
            });
            $(document).on('click', '#ordered .sureBtn.confirm-ok-cancel',function (e) {
                var id = $(this).attr("data-id");
                $.confirm('是否确认消费?',
                    function () {
                        //console.log('id:'+ id);
                        var params = {
                            tradeId:id,
                        }
                        $.post("/trade/confirmShipment.json", params, function(data){
                            //console.log(params);
                            //console.log(data);
                            if(data.result=="ok"){
                                $.toast("确认消费成功");
                                $(e.target).parent().parent().parent().parent().remove();
                            }
                        });
                    },
                    function () {
                        //console.log('You clicked Cancel button');
                    }
                );
                //allOrder中取消订单按钮点击事件
            })
        },

    };
    module.exports.init();
});
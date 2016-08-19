/**
 * Created by pk111 on 2016/8/9.
 */
/**
 * Created by pk111 on 2016/8/3.
 */
define(function(require, exports, module){
    require("$");
    require("sm");
    require("touch");
    require("deferred");
    require("callbacks");
    var Swiper = require("swiper");
    var listtype = require("./producttype.handlebars");
    var tmpform = require("./additem.handlebars");
    var tools =require("tools");
    var piclist;
    var lefting=0;//是否出现了侧滑
    var numpic=0;
    var number;
    var mySwiper = new Swiper('.swiper-container', {
        loop :false,
        pagination : '.swiper-pagination',
        observer:true
    });
    module.exports = {
        init:function () {
            var self = this;
        //  self.deleitemBind();
            self.getGoodsinfo().then(function () {
                self.additemBind();
                self.deleitemBind();
                self.picturnPrelook();
                self.ajaxGet();
            })
        },
        getGoodsinfo:function () {
            var deferen = $.Deferred();
            var self = this;
            $.ajax({
                type: 'post',
                cache: false,
                url: '/product/getProductDetail',
                data: {
                    productId:tools.GetQueryString("goodid"),
                    type : 1
                },
                success: function(data) {
                    if(data.result==="ok") {
                        //显示图片
                        piclist = data.data.picPath;
                        for(var i =0;i<piclist.length;i++){
                            if(piclist[i] !==""){
                                $("#upimgpre").append("<div class='preup swiper-slide piceuu'><img data-abo='" + i + "' src='" + piclist[i] + "'></div>");
                            }
                            $(".uploadpic").css("display","none");
                            $(".deletepicbtn").css("display","block");
                            $(".swiper-pagination").css("display","block");
                        }

                        self.deletePic();
                        //显示规格
                        if(data.data.productSpecList.length>0){
                            $("#moreContro").html(tmpform(data.data.productSpecList));
                        }
                        //显示名称和介绍
                        $("#productName").val(data.data.name);
                        $("#productDetail").val(data.data.detail);
                        number = data.data.catalogId;
                        self.ajaxUp(data.data.catalogId)
                        deferen.resolve();
                    } else {
                        $.alert("<div class='error-tip'>"+"加载出错"+"</div>",'提示');
                    }
                }
            });
            return deferen.promise();
        },
        ajaxUp:function (f) {
            var self = this;
            var defer = $.Deferred();
            $.ajax({
                type: 'post',
                cache: false,
                url: '/catalog/getAllCatalog',
                success: function(data) {
                    if(data.result=="ok") {
                        for(var i=0;i<data.data.length;i++){
                            if(data.data[i].id === f){
                                data.data[i].sureActive = 1;
                                $("#typeNameShow").html(data.data[i].name);
                            }
                        }
                        $("#productType").html(listtype(data));
                        self.chooseItem();
                        defer.resolve(true);
                    } else {
                        $.alert("<div class='error-tip'>"+data.error+"</div>",'提示');
                    }
                }
            });
            return defer.promise();
        },

        chooseItem:function () {
            $(document).on('click','.open-about', function () {
                $.popup('.popup-about');
                $("#ok").css("display","block");
            });
            $("#ok").on("click",function () {
                $.popup('.popup-about');

            });
            $(".popup").on("close",function () {
                number = $(".type.active").data("typeNum");
                var typename = $(".type.active").html();
                $("#ok").css("display","none");
                $("#typeNameShow").html(typename);
            });
            $(".type").on("click",function (e) {
                $(".type").removeClass("active");
                $(e.target).addClass("active");
            })
        },
        //点击加号
        additemBind:function () {
            var self = this;
            $(".addmore").on("click",function () {
                $("#moreContro").append(tmpform());
                self.deleitemBind();
            })
        },
        //点击负号
        deleitemBind:function () {
            var self = this;
            $(".icon-reduce").unbind("click").on("click",function (e) {
                if(lefting==0){
                    $(e.target).parent().parent().css("marginLeft","-4.5rem");
                    lefting=1;
                    self.closeslice($(e.target).parent().parent());
                    self.deleitemSure($(e.target).parent().parent());
                }
            });
        },
        //关闭侧滑
        closeslice:function(section) {
            section.swipeRight(function () {
                section.css("marginLeft","0");
                lefting = 0;
            })
        },
        //删除规格
        deleitemSure:function (section) {
            var self=this;
            var itimeclear;
            section.children('.right-silde').on("click",function (e) {
                clearTimeout(itimeclear);
                section.css({"height":"0","marginLeft":"0","z-index":"-9"});
                itimeclear = setTimeout(function () {
                    section.remove();
                    self.deleitemBind();
                },200);
                lefting = 0;
            })
        },
        //删除图片
        deletePic:function () {
            var self = this;
            $("#deletePic").unbind("click").on("click",function (e) {
                if($(".swiper-slide-active").data("abo")){
                    $(".swiper-slide-active").remove();
                }else{
                    var nowpic = $(".swiper-slide-active").data("numpic");
                    $(".swiper-slide-active").remove();
                    var searchList = $("#new-form input");
                    for(var i =0;i<searchList.length;i++){
                        if($("#new-form input").eq(i).data("numpic")===nowpic){
                            $("#new-form input").eq(i).remove();
                        }
                    }
                }
                if($(".preup").length<1){
                    $("#upimgpre .uploadpic").css("display","block");
                    $(".deletepicbtn").css("display","none");
                    $(".swiper-pagination").css("display","none");
                }
            })
        },
        //新添加图片预览
        picturnPrelook:function () {
            var self = this;
            $(".imgget").on("change", function (e){
                // samllImg.push(samllImgone);
                showPreview(e.target, numpic);
                numpic++;
            });
            function showPreview(source, num) {
                var file = source.files[0];
                if (window.FileReader) {
                    var fr = new FileReader();
                    fr.readAsDataURL(file);
                        fr.onloadend = function (event) {
                            if (event.target.result) {//判断图片是否为空
                                $("body").append("<canvas id='myCanvas' style='display:none'></canvas>");
                                var Cnv = document.getElementById('myCanvas');
                                var Cntx = Cnv.getContext('2d'); //获取2d编辑容器
                                var imgss = new Image(); //创建一个图片
                                imgss.crossOrigin = 'anonymous';
                                imgss.src = event.target.result;
                                imgss.onload =function () {
                                    var m = imgss.width / imgss.height;
                                    Cnv.height = 300 ; //该值影响缩放后图片的大小
                                    Cnv.width = 300 * m;
                                    Cntx.drawImage(imgss, 0, 0, 300 * m, 300 );
                                    var Pic = document.getElementById("myCanvas").toDataURL();
                                    $("#upimgpre").append("<div class='preup swiper-slide'><img data-numpic='" + numpic + "' src='" + Pic + "'></div>"); //输出预览图
                                    $("#myCanvas").remove();
                                    numpic++;
                                    $(source).removeClass("imgget");//隐藏这个表单
                                    $("#new-form").append("<input accept='image/*' type='file' class='imgget' data-numpic='" + numpic + "'>");//增加提交框
                                    self.picturnPrelook();//重新input绑定点击预览
                                    if ($(".preup").length > 0) {
                                        $(".uploadpic").css("display", "none");
                                        $(".deletepicbtn").css("display", "block");
                                        $(".swiper-pagination").css("display", "block");
                                    }
                                    self.deletePic();//绑定删除图片
                                    return 1;
                                };
                            } else {
                                self.picturnPrelook();
                                return 0;
                            }
                        };
                    }
                }
            },
        //点击上传和校验
        ajaxGet:function () {
            var self  =this;
            var sureing = 0;
            $("#sure").unbind("click").on("click",function () {
                if(sureing==0){
                    sureing=1;
                    /*获取表单值*/
                    var upData= new FormData();
                    if(number==="none"){
                        $.alert("<div class='error-tip'>"+"请选择合适的商品类型"+"</div>",'提示');
                        sureing = 0;
                        return false ;
                    }else{
                        upData.append("catalogId",number)
                    }
                    if($("#productName").val() && $("#productName").val().length>2){
                        upData.append("name",$("#productName").val());
                    }else{
                        $.alert("<div class='error-tip'>"+"请填写至少三个字的商品名称"+"</div>",'提示');
                        sureing = 0;
                        return false ;
                    }
                    upData.append("detail",$("#productDetail").val());
                    if($(".rightmore").length==0){
                        $.alert("<div class='error-tip'>"+"请填写至少一个商品规格"+"</div>",'提示');
                        sureing = 0;
                        return false ;
                    }else{
                        var prespecStr={};
                        prespecStr.specStr =[];
                        var Reg = new RegExp(/^\d+(.\d{1,2})?$/);
                        for(var j=0;j<$(".rightmore").length;j++){
                            var nowGetname = $(".rightmore").eq(j).children(".morename").val();
                            var nowGetOnePrice = $(".rightmore").eq(j).find(".oneprice").val();
                            var nowGetTwoPrice = $(".rightmore").eq(j).find(".twoprice").val();
                            var nowGetThreePrice = $(".rightmore").eq(j).find(".threeprice").val();
                            //验证是否为空
                            if(nowGetname && nowGetOnePrice && nowGetTwoPrice && nowGetThreePrice){
                                if(Reg.test(nowGetOnePrice) && Reg.test(nowGetTwoPrice) && Reg.test(nowGetThreePrice)){
                                    prespecStr.specStr.push({spec:nowGetname,primePrice:nowGetOnePrice,currentPrice:nowGetTwoPrice,backPrice:nowGetThreePrice})
                                }else{
                                    $.alert("<div class='error-tip'>"+"请正确填写价格，仅能保留两位小数"+"</div>",'提示');
                                    sureing = 0;
                                    return false ;
                                }
                            }else{
                                $.alert("<div class='error-tip'>"+"请填写规格和售价"+"</div>",'提示');
                                sureing = 0;
                                return false;
                            }
                        }
                        upData.append("specStr",JSON.stringify(prespecStr.specStr))
                    }
                    var canPiclist =$("#upimgpre .preup");
                    if(canPiclist.length<1){
                        $.alert("<div class='error-tip'>"+"请至少上传一张可用的图片"+"</div>",'提示');
                        sureing = 0;
                        return false ;
                    }else{
                        var pcinone="";
                        if($(".piceuu").length>0){
                            for(var i=0;i<$(".piceuu").length;i++){
                                pcinone +=($(".piceuu").eq(i).children("img").attr("src"))+";";
                            }
                            upData.append("urls",pcinone);
                        }
                        if($("#new-form input").length>1){
                            var img=[];
                            for(var i=0;i<$("#new-form input").length-1;i++){
                                var file =  $("#new-form input")[i].files[0];
                                upData.append("img["+i+"]",file);
                            }
                        }
                    }
                    upData.append("id",tools.GetQueryString("goodid"));
                    $.showIndicator();
                        $.ajax({
                            type: 'post',
                            url: '/product/editProduct',
                            data: upData,
                            cache: false,
                            contentType: false,
                            processData: false,
                            complete:function () {
                                $.hideIndicator();
                            },
                            success: function(data) {
                                if(data.result==="ok") {
                                    window.location.href="/product/upSuccess";
                                } else {
                                    $.alert("<div class='error-tip'>"+data.msg+"</div>",'提示');
                                    window.location.reload();
                                }
                            }
                        });
                }
            })
        }
    };
    module.exports.init();

});
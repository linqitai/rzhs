/**
 * Created by pk111 on 2016/8/3.
 */
define(function(require, exports, module){
    require("$");
    require("sm");
    // require("sm-extend");
    require("touch");
    require("deferred");
    require("callbacks");
    // var attachFastClick = require('fastclick');
    var Swiper = require("swiper");
    var listtype = require("./producttype.handlebars");
    var tmpform = require("./additem.handlebars");
    var tools =require("tools");
    var samllImg = [];
    var lefting=0;//是否出现了侧滑
    var number="none";//记录选择的类型
    var numpic=0;//记录图片预览的数字
    var mySwiper = new Swiper('.swiper-container', {
        loop :false,
        pagination : '.swiper-pagination',
        observer:true
    });;
    module.exports = {
        init:function () {
            var self = this;
            //解决点透事件 
            // attachFastClick(document.body);
            // self.deleitemBind();
            $(".swiper-pagination").css("display","none");
            self.ajaxUp().then(function () {
                self.picturnPrelook();
                self.additemBind();
                self.chooseItem();
                self.ajaxGet();
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
                // var listnnum = tools.searchNumber(nowNumber,$(e.target).data("addnumber"));
                // nowNumber.splice(listnnum,1);
                section.css({"height":"0","marginLeft":"0","z-index":"-9"});
                itimeclear = setTimeout(function () {
                    section.remove();
                    self.deleitemBind();
                    },200);
                lefting = 0;
            })
        },
        //选择类型
        chooseItem:function () {
            $(document).on('click','.open-about', function () {
                $.popup('.popup-about');
                $("#ok").css("display","block");
            });
            $("#ok").on("click",function () {
                    $.popup('.popup-about');

            });
            $(".popup").on("close",function () {
                var typename="无";
                    number = $(".type.active").data("typeNum") || "none";
                    typename = $(".type.active").html() || typename;
                    $("#ok").css("display","none");
                    $("#typeNameShow").html(typename);
            });
            $(".type").on("click",function (e) {
                $(".type").removeClass("active");
                $(e.target).addClass("active");
            })
        },
        //获取类型
        ajaxUp:function () {
            var defer = $.Deferred();
            $.ajax({
                type: 'post',
                cache: false,
                url: '/catalog/getAllCatalog',
                success: function(data) {
                    if(data.result=="ok") {
                        $("#productType").html(listtype(data));
                        defer.resolve(true);
                    } else {
                        $.alert("<div class='error-tip'>"+data.error+"</div>",'提示');
                    }
                }
            });
            return defer.promise();
        },
        //图片点击预览
        picturnPrelook:function () {
            var self = this;
            $(".imgget").on("change",function (e){
                var file = e.target.files[0];
                if(window.FileReader) {//读取文件
                    var fr = new FileReader();
                    fr.readAsDataURL(file);
                    fr.onloadend = function(event) {
                        if(event.target.result){//判断图片是否为空
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
                                $("#upimgpre").append("<div class='preup swiper-slide'><img data-numpic='"+numpic+"' src='" + Pic +"'></div>"); //输出预览图
                                $("#myCanvas").remove();
                                numpic++;
                                $(e.target).removeClass("imgget");//隐藏这个表单
                                $("#new-form").append("<input accept='image/*' type='file' class='imgget' data-numpic='"+numpic+"'>");//增加提交框
                                self.picturnPrelook();//重新input绑定点击预览
                                if($(".preup").length>0){
                                    $(".uploadpic").css("display","none");
                                    $(".deletepicbtn").css("display","block");
                                    $(".swiper-pagination").css("display","block");
                                }
                                self.deletePic();//绑定删除图片
                                return 1;
                            };
                        }else{
                            self.picturnPrelook();
                            return 0;
                        }
                    };
                }
            });
        },
        //删除图片
        deletePic:function () {
        var self = this;
        $(".deletepicbtn").unbind("click").on("click",function (e) {
            var nowpic = $(".swiper-slide-active img").data("numpic");
            console.log($(".swiper-slide-active"));
            $(".swiper-slide-active").remove();
            var searchList = $("#new-form input");
            for(var i =0;i<searchList.length;i++){
                if($("#new-form input").eq(i).data("numpic")===nowpic){
                    $("#new-form input").eq(i).remove();
                }
            }
            if($(".preup").length<1){
                $("#upimgpre .uploadpic").css("display","block");
                $(".deletepicbtn").css("display","none");
                $(".swiper-pagination").css("display","none");
            }

        })
    },
    //提交验证****图片暂未处理
    ajaxGet:function () {
            var self  =this;
            var sureing = 0;
            $("#sure").on("click",function () {
                if(sureing==0){
                    sureing=1;
                    /*获取表单值*/
                    var upData= new FormData();
                    //商品类型选择验证
                    if(number==="none"){
                        $.alert("<div class='error-tip'>"+"请选择合适的商品类型"+"</div>",'提示');
                        sureing = 0;
                        return false ;
                    }else{
                        upData.append("catalogId",number);
                    }
                    //商品名称验证
                    if($("#productName").val() && $("#productName").val().length>2 && $("#productName").val().length<35){
                        upData.append("name", $("#productName").val());
                    }else{
                        $.alert("<div class='error-tip'>"+"请填写至少两个字以上的商品名称"+"</div>",'提示');
                        sureing = 0;
                        return false ;
                    }
                    upData.append("detail" ,$("#productDetail").val());
                    //商品规格验证
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
                                    $.alert("<div class='error-tip'>"+"请正确填写价格"+"</div>",'提示');
                                    sureing = 0;
                                    return false ;
                                }
                            }else{
                                $.alert("<div class='error-tip'>"+"规格和售价不能为空"+"</div>",'提示');
                                sureing = 0;
                                return false ;
                            }
                        }
                        upData.append("specStr",JSON.stringify(prespecStr.specStr));
                    }
                    //图片验证
                    var canPiclist =$("#upimgpre .preup");
                    if(canPiclist.length<1){
                        $.alert("<div class='error-tip'>"+"请至少上传一张可用的图片"+"</div>",'提示');
                        sureing = 0;
                        return false ;
                    }else{
                            var img=[];
                            for(var i=0;i<$("#new-form input").length-1;i++){
                                var file =  $("#new-form input")[i].files[0];
                                    upData.append("img["+i+"]",file);
                            }
                        $.showIndicator();
                            $.ajax({
                                    type: 'post',
                                    url: '/product/addProduct',
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
                                            self.ajaxGet()
                                        }
                                    }
                                });
                    }
                }
             })
         }
    };
    module.exports.init();

});
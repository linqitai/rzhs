/**
 * Created by pk111 on 2016/8/3.
 */
define(function(require, exports, module){
    var $ = require("$");
    require("sm");
    require("touch");
    require("deferred");
    require("callbacks");    
    //require("sm-extend");    
    var attachFastClick = require("fastclick");

    var Tools = require("tools");  
    var typenumber = 0;
    module.exports = {
        init: function() {
            var self = this;
            //解决点透事件
            attachFastClick(document.body);
            self.chooseItem();
            self.goodsInfo();
        },
        goodsInfo: function() {
            var self = this;
            self.id = Tools.GetQueryString("id");
            self.order = Tools.GetQueryString("order");

            if(self.order && self.order == 1) {
                $("#sure").show();
            }

            $.ajax({          
                type: 'post',
                data: {
                    productId: self.id
                },                             
                cache: false,
                url: '/product/getProductDetail',
                success: function(data) {
                    if(data.result == "ok") {                       
                        $("#J_detail_name").html(data.data.name);
                        //价格区间
                        $("#J_detail_price").html(data.data.priceArea);                       
                        $("#J_detail_txt").html(data.data.detail);

                        //原价
                        $("#J_origin_price").html(data.data.productSpecList[0].primePrice);
                        //返佣
                        $("#J_voucher_Money").html(data.data.productSpecList[0].backPrice);
                        //当前价格
                        $("#J_curreny").html(data.data.productSpecList[0].currentPrice);

                        var str = '', typeStr = '', lens = data.data.picPath.length, specLens = data.data.productSpecList.length;
                        for(var i=0; i<lens; i++){
                            if(i==0) {
                                //取压缩后的图片
                                // $("#J_detail_img").attr("src", data.data.picPath[0]);
                                $("#J_detail_img").attr("src", data.data.zoomPicPath[1]);
                            } else {
                                str += "<li><img src="+ data.data.picPath[i] +"></li>";
                                $("#J_show_img").html(str);
                            }
                        }

                        //规格                       
                        for(var j=0; j<specLens; j++) {                            
                            typeStr += "<li class='type' data-typeNum='"+data.data.productSpecList[j].id+"'>"+data.data.productSpecList[j].spec+"</li>";
                            $("#J_detail_type").html(typeStr);
                            $("#J_detail_type li").eq(0).addClass("active");                           
                        }

                        //切换规格
                        $(".type").live("click",function (e) {
                            // $(".type").removeClass("active");
                            $(e.target).addClass("active").siblings().removeClass("active");
                            var index = $(this).index();           

                            //原价
                            $("#J_origin_price").html(data.data.productSpecList[index].primePrice);
                            //返佣
                            $("#J_voucher_Money").html(data.data.productSpecList[index].backPrice);
                            //当前价格
                            $("#J_curreny").html(data.data.productSpecList[index].currentPrice);
                        });

                    }
                }
            });
        },
        chooseItem: function() {
            var self = this;
            $(document).on('click','.open-about', function () {
                $.popup('.popup-about');
                $("#ok").css("display","block");
            });
            $(".popup").on("close",function () {
                $("#ok").css("display","none");
            });
           
            $("#ok").on("click",function () {
                var typenumber = $(".type.active").data("typeNum");
                var spec = $("#J_detail_type .type.active").html();
                var back = $("#J_voucher_Money").html();
                var price = $("#J_curreny").html();
                window.location.href = encodeURI("/product/goodDetails/orderSure.htm?id="+self.id+"&specId="+typenumber+"&spec="+spec+"&back="+back+"&price="+price);
            });
        }
    };
    module.exports.init();
});
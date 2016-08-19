/**
 * Created by pk111 on 2016/8/3.
 */
define(function(require, exports, module){
	require("$");
    require("sm");
    var Tools = require("tools");
    var attachFastClick = require("fastclick");
    module.exports = {
    	init: function () {
            var self = this;
            //解决点透事件
            attachFastClick(document.body);
            self.getName();
            self.addReduceNum();
            self.num = 1;
            //默认也计算订单总价和支付金额
            self.amountAjax();
            self.orderSure();
            //校验标志位
            self.validataFlag = false;
        },
        getName: function() {
        	var self = this;            
        	self.id = Tools.GetQueryString("id");
        	self.specId = Tools.GetQueryString("specId");         
        	self.price = Tools.GetQueryString("price");
        	self.back = Tools.GetQueryString("back");
            self.spec = Tools.GetQueryString("spec");


            var urlObj = Tools.GetRequest();
            self.spec = urlObj["spec"];
          
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
                        $("#J_detail_img").attr("src",data.data.zoomPicPath[0]);
                    }
                }
            });
            var placeStr = "最多"+self.back+"元";
            $("#J_money_input").attr("placeholder", placeStr);
            $("#J_detail_type").html(self.spec);
            $("#J_origin_price").html(self.price);
            $("#J_all_money").html(self.price);
        },
        addReduceNum: function () {
        	var self = this;
        	var n = 1;            
    		$("#J_add").on("click", function(){    			
    			self.num = ++n;
    			$("#J_num").html(self.num);
    			$("#J_all_num").html(self.num);
                // $.showIndicator();
                self.amountAjax();
    		});

    		$("#J_reduce").on("click", function(){
    			if(n > 0) {
    				self.num = --n;
    				$("#J_num").html(self.num);
    				$("#J_all_num").html(self.num);
                    // $.showIndicator();
                    self.amountAjax();
    			}    			
    		});

            // $("#J_money_input").change(function(e) {
            //     if(!/^(([1-9]{1}\d*)|([0]{1}))(\.(\d){1,2})?$/.test(this.value)) {
            //         $.toast("请输入正确金额");
            //         $(this).val("").focus();
            //         self.validataFlag = true;
            //     } else {
            //         if( parseInt($('#J_money_input').val()) > parseInt(self.back) ){
            //            $.toast("代金券最多可用"+self.back+"元");
            //            $(this).val("").focus();
            //            self.validataFlag = true;
            //         } else {
            //             self.validataFlag = false;
            //         }
            //     }                              
            // });
          
            // $('#J_money_input').on("keyup", Tools.debounce(function(event) { 
            //     if( parseInt($('#J_money_input').val()) > parseInt(self.back) ){
            //        $('#J_money_input').val("");
            //     }         
            //     self.amountAjax();
            // }, 100));
        },           
        amountAjax: function() {
            var self = this;
            $.ajax({    
                type: 'post',
                data: {
                    price: self.price,
                    discount: $("#J_money_input").val(),
                    amount: self.num
                },                             
                cache: false,
                url: '/trade/getTotalPrice.json',
                success: function(data) {
                    if(data.result == "ok") {
                        // $.hideIndicator();                                       
                        $("#J_all_money").html(data.data.payment);
                        $("#J_all_money").attr("data-price", data.data.totalPrice);
                    }
                }
            });
        },
        orderSure: function() {
            var self = this;            
            $("#J_order_sure").on("click", function(){

                if(!$("#J_money_input").val()){
                    self.validataFlag = false;
                }else {
                   if(!/^(([1-9]{1}\d*)|([0]{1}))(\.(\d){1,2})?$/.test($("#J_money_input").val())) {
                        $.toast("请输入正确金额");
                         // $.alert("请输入正确金额");
                        $("#J_money_input").val("");
                        self.validataFlag = true;
                    } else {
                        if( parseInt($('#J_money_input').val()) > parseInt(self.back) ){
                           $.toast("代金券最多可用"+self.back+"元");
                            // $.alert("代金券最多可用"+self.back+"元");
                           $("#J_money_input").val("");
                           self.validataFlag = true;
                        } else {
                            self.validataFlag = false;
                        }
                    } 
                }                        

                if(!self.validataFlag){
                    $.ajax({    
                        type: 'post',
                        data: {
                            sellerId: 2,
                            buyerId: 1,
                            totalPrice:  $("#J_all_money").attr("data-price"),
                            discount: $("#J_money_input").val()||0,
                            payment: $("#J_all_money").html(),
                            shopId: 1,
                            productId: self.id,
                            specId: self.specId,                   
                            amount: self.num
                        },                             
                        cache: false,
                        url: '/trade/createTrade.json',
                        success: function(data) {
                            if(data.result == "ok") {                               
                                // var t = $('#J_money_input').val();
                                // alert(t);                     
                                window.location.href = "/product/goodDetails/orderSuccess.htm";
                            }
                        }
                    });
                }                              
            });           
        }
    };
    module.exports.init();
});
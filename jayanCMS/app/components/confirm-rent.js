import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Component.extend({
   actions:{

     confirmOrder(id,type){

       if($('#confirmRent').validate()!==true){
         return;
       }
       let payMethod=$("#c_payMethod").attr("data-value");
       if(type=="house"){
         this.send("confirmHouse",id,payMethod)
       }else{
         this.send("confirmRoom",id,payMethod)
       }
     },
     confirmHouse(id,payMethod){

       let _this=this;
       this.get('auth').registerTokenToAjaxHeader();
       let url = this.get("config").apiUrl + "payhouseorders/"+id;
       ajax(url, {
         method: 'patch',
         data:{
           "tag":"payMethod",
           "pay_method":payMethod,
           "trade_serial_no":$("#c_trade_serial_no").val(),
           "actual_pay_time":$("#actual_pay_time").val()
         }
       }).then((res) => {

         $.toastr.success("交租成功!");
         $("#confirmRent .xsd-modal-close").trigger("click");
         _this.sendAction("updateStatus",_this.get("bill").attributes.house_id,"house");

       }).catch((err)=> {

         $.toastr.error("交租失败!");

       });
     },

     confirmRoom(id,payMethod){

       let _this=this;
       let url = this.get("config").apiUrl + "payroomorders/"+id;
       ajax(url, {
         method: 'patch',
         data:{
           "tag":"payMethod",
           "pay_method":payMethod,
           "trade_serial_no":$("#c_trade_serial_no").val(),
           "actual_pay_time":$("#actual_pay_time").val()
         }

       }).then((res) => {

         $.toastr.success("交租成功!");
         $("#confirmRent .xsd-modal-close").trigger("click");
         _this.sendAction("updateStatus",_this.get("bill").attributes.room_id,"room");

       }).catch((err)=> {

         $.toastr.error(err.jqXHR.responseJSON.errors.detail);

       });

     },

     // 分步支付
     roomConfirm(id) {
       if($('#confirmRent').validate()!==true){
          return;
       }

       let _this = this,
            url  = this.get("config").apiUrl + "payroomorders/" + id;


       ajax(url, {
         method: 'patch',
         data:{
           'tag': 'payMethod',
           'pay_method': $('#c_payMethod').data('value'),
           'trade_serial_no': $("#c_trade_serial_no").val(),
           'actual_pay_time': $("#actual_pay_time").val(),
           'pay_uuid': $("#pay_uuid").val(),
           'rent_amount': $('#c_rent_amount').val(),
           'rent_deposit': $('#c_rent_deposit').val(),
           'water_fees': $('#c_water_fees').val(),
           'power_fees': $('#c_power_fees').val(),
           'gas_fees': $('#c_gas_fees').val(),
           'property_fees': $('#c_property_fees').val(),
           'service_fees': $('#c_service_fees').val(),
           'cleaning_fees': $('#c_cleaning_fees').val(),
           'upkeep_fees': $('#c_upkeep_fees').val(),
           'material_fees': $('#c_material_fees').val(),
           'catv_fees': $('#c_catv_fees').val(),
           'internet_fees': $('#c_internet_fees').val(),
           'sanitation_fees': $('#c_sanitation_fees').val(),
           'free_fees': $('#c_free_fees').val(),
           'other_fees': $('#c_other_fees').val(),
         }

       }).then((res) => {
         $.toastr.success('交租成功!');
         $("#confirmRent .xsd-modal-close").trigger("click");
         _this.sendAction("updateStatus", _this.get("bill").attributes.room_id, "room");
       }).catch((err)=> {
         $.toastr.error(err.jqXHR.responseJSON.errors.detail);
       });
     }

   }
});

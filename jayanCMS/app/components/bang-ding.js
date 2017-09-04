import Ember from 'ember';
import ajax from 'ic-ajax';
import sendcode from '../utils/sendcode';

export default Ember.Component.extend({

  actions:{

     bindCard:function () {
       if($('#bang-ding').validate()!==true){
         return;
       }
       this.get('auth').registerTokenToAjaxHeader();
       ajax(this.config.apiUrl1 + 'landlord/bank/card', {
         method: 'POST',
         data:{
          card_no: $("#bankNumber").val(),
          owner_name:$("#ownerName").val(),
          bank_name: $("#selectBank").val(),
          branch_bank:$('#subBranch').val(),
          phone: $("#phoneNumber").val(),
          code:$("#phoneValidate").val(),
         }
       }).then((res)=> {
         $('#bang-ding .xsd-modal-header .xsd-modal-close').trigger("click");
         this.sendAction("refreshPay");
         $.toastr.success("绑卡成功!")
       }).catch((xhr, err) => {
         $.toastr.error(xhr.jqXHR.responseJSON.errors.detail)
       });

     },
     sendCode:function () {


       sendcode($("#phoneNumber").val(),$("#bang-ding .btnSendCode"), this.config.apiUrl + "verifycode");

     }

  }
});

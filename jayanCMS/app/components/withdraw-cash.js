import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Component.extend({

  actions:{

    getCash:function () {
      if($('#withdraw-cash').validate()!==true){
        return;
      }
      this.get('auth').registerTokenToAjaxHeader();
      let amount=$("#withdrawMoney").val();
      if(amount.indexOf('.')!=-1){
        amount=Number(amount.substring(0,amount.indexOf('.')+3));
      }else{
        amount=parseInt(amount);
      }
      ajax(this.config.apiUrl1 + 'landlord/withdrawal', {
        method: 'POST',
        data:{
          amount:amount,
          phone: $("#registeredPhoneNum").val(),
          code:$("#w-phoneValidate").val(),
        }
      }).then((res)=> {
        $('#withdraw-cash .xsd-modal-header .xsd-modal-close').trigger("click");
        $.toastr.success("申请成功!请等待管理员审核打款!");
        this.sendAction('refreshPay');
      }).catch((xhr, err) => {
        $.toastr.error(xhr.jqXHR.responseJSON.errors.detail)
      });

    },
    sendCode:function () {

      let url = this.config.apiUrl + "verifycode",dom=$("#withdraw-cash .btnSendCode");
      ajax(url, {
        data: {
          "phone": $("#registeredPhoneNum").val(),
        },
        method: 'GET'
      }).then((res) => {
        let num = 60;
        dom.val(num + "秒后重新获取");
        dom.attr("disabled","disabled");
        let interval = setInterval(function () {
          num = num - 1;
          dom.val(num + "秒后重新获取");
          if(num==0){
            clearInterval(interval);
            dom.val("重新发送");
            dom.removeAttr("disabled")
          }
        }, 1000);


      }).catch((xhr, err) => {

        $.toastr.error('服务器出错')
      });

    }
  }
});

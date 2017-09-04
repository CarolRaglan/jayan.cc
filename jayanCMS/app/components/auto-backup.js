import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Component.extend({

  curCount: "",
  updateTime:"半个月",
  priod:"每月1号、16号",

  didInsertElement:function () {

  },

  actions: {

    sendMessage(e){
      let dom = $(event.target);
      let email = dom.parent().parent().parent().prev().find("input").val();
      let emailCode = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      if (!emailCode.test(email)) {
        $.toastr.error("请输入正确的邮箱格式!");
        return;
      }
      let _this = this;
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl1 + "backupsverify";
      let curCount = 89,dom1=$("#auto-backup .btnSendCode");//当前剩余秒数
      dom1.attr("disabled", "true");
      dom1.css({'background': '#cccccc', 'opacity': '0.8'});
      dom1.val("请在" + curCount + "秒内输入验证码");
      ajax(url, {
        method: 'GET',
        data: {
          "email": email,
        },
      }).then((res) => {

        window.InterValObj = setInterval(
          function () {
            if (curCount == 0) {
              clearInterval(window.InterValObj);//停止计时器
              dom1.removeAttr("disabled");//启用按钮
              dom1.css({'background': '#ffffff'});
              dom1.val("重新发送验证码");
            }
            else {
              curCount--;
              dom.val("请在" + curCount + "秒内输入验证码");
            }

          }, 1000);
      }).catch((err)=> {

        $.toastr.error('服务器出错')

      });

    },

    updateStr(str){
      this.set("priod",str);
    },

    ensure(){
      if ($('#backup').validate() !== true) {
        return;
      }
      let email = $("#updateBox").val()
      let code = $("#updateValidate").val()
      let interval = $("#updateTime").attr("data-value");
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.config.apiUrl1 + "backupsreports";
      ajax(url, {
        data: {
          "email": email,
          "code": code,
          "interval": interval
        },
        method: 'POST'
      }).then((res) => {
        $.toastr.success("备份成功");
        this.send("closeModal",true);
      }).catch((err) => {
        $.toastr.error('验证码错误或过期')
      });
    },

    update(){

      this.set("backup.status",false);
      this.send("closeModal",false);

    },

    closeModal(flag){

      if(flag){
        this.$("#auto-backup .xsd-modal-header .xsd-modal-close").trigger("click");
        return;
      }
      $("#updateBox").val("");
      $("#updateValidate").val("");
      $("#updateTime").val("");
      clearInterval(window.InterValObj);
      $("#auto-backup .btnSendCode").removeAttr("disabled");
      $("#auto-backup .btnSendCode").val("发送验证码");
      $("#auto-backup .btnSendCode").css({'background': '#ffffff'});

    },

    deleteBackup(){

      this.get('auth').registerTokenToAjaxHeader();
      let url = this.config.apiUrl1 + "backupsreports";
      ajax(url, {
        method: 'DELETE'
      }).then((res) => {
        this.send("closeModal",true);
      }).catch((err) => {
        $.toastr.error('服务器错误')
      });

    }

  }

});

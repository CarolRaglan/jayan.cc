import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Component.extend({
  didInsertElement:function () {
  },

  actions:{

    passwordSet(e){
      //表单验证
      if($('#public-form').validate()!==true){
        return;
      }
      let _this = this;
      let url = this.get("config").apiUrl + "users/set_password";
      let _params = {};
      _params.phone = this.auth.user.phone;
      _params.code = $('#code').val();
      _params.new_pwd = $('#password').val();
      ajax(url, {
        method: 'Put',
        data:_params,
      }).then((res) => {
        $.toastr.success('修改成功');
        _this.get("auth").logout();
        _this.get("router").transitionTo("/");

      }).catch((err)=> {
        $.toastr.error('服务器出错')
      });

    },

    sendCode(e){

      let dom=$(event.target);
      let url = this.get("config").apiUrl + "verifycode";
      let _params = {};
      _params.phone = this.get("auth").user.phone;
      let txt=dom.text();
      if(txt!="获取验证码"&&txt!="重新发送"){
        return;
      }
      ajax(url, {
        method: 'Get',
        data:_params,
      }).then((res) => {

        var num = 60;
        dom.text(num + "秒后重新获取");
        var interval = setInterval(function () {
          num = num - 1;
          dom.text(num + "秒后重新获取");
        }, 1000);
        setTimeout(function () {
          clearInterval(interval);
          dom.text("重新发送")
        }, 60000);

      }).catch((err)=> {
        $.toastr.error('服务器出错')
      });
    }
  }
});

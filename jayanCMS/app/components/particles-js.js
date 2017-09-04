import Ember from 'ember';

export default Ember.Component.extend({

  didInsertElement: function () {

    $("#sign .banner ul").slider(400);
    $("#xsd-modal-mask").hide();
    //访客登录
    let args = window.location.search;
    if (args.indexOf("user")!=-1&&args.indexOf("psd")!=-1) {
      let user = getArgs("user"),
        psd = getArgs("psd");
      this.auth.login(user, psd)
        .then((obj)=> {
          if (obj != false) {
            this.get('router').transitionTo("index");//登陆成功跳转
          } else {
            $.toastr.error('访客进入失败!');
          }
        })
      function getArgs(name) {
        let reg = new RegExp("(^|&)" +name+ "=([^&]*)(&|$)", "i");
        return args.substr(1).match(reg)[2];
      }
    }
    
  }
});

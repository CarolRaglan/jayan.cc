import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Component.extend({

  didInsertElement:function () {

    if(this.get("auth").user.is_first_login){

      $("#agreement_btn").click();
    }

  },

  actions:{

    readed(){

      let _this=this;
      _this.get('auth').registerTokenToAjaxHeader();
      let url = _this.get("config").apiUrl + "accounts/"+ _this.get("auth").user.id;
      ajax(url, {
        method: 'Put',
        data:{
          "is_first_login":false
        },
      }).then((res) => {

        _this.get("auth").user.is_first_login=false;
        _this.get("auth").persistToken();
        $.toastr.success('欢迎使用水滴管家!');
      }).catch((err)=> {
        $.toastr.error('操作失败');
      });
    }
  }
});

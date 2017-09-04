import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Component.extend({

  fresh:true,
  didInsertElement:function(){
    this.send("checkMember");
    //测试环境刷新页面更新权限
    // if(this.get("config").environment ==='dev'){
      this.get("auth").getPower(this.get("auth").user.role,this.get("auth").user.id);
    // }
  },
  actions:{

    logout(){
      this.get("auth").logout();
      $.removeCookie('user', {path:'/'});
      this.get("router").transitionTo("user.sign");

    },
    noBuy(){
      $('#publicModal #noBuyTrigger').trigger('click');
    },
    getMailbox(){

      let _this = this;
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.config.apiUrl1 + "backupsreports";
      ajax(url, {
        method: 'get'
      }).then((res) => {
        _this.set("backup", res.data);

      }).catch((err) => {

      });

      _this.set("fresh", false);
      Ember.run.next(function () {
        _this.set("fresh", true);
      });

    },

    //会员判断
    checkMember(){
      let user = this.get("auth").user;
      let is_vip = user.vip_level > 0?true:false;
      //会员到期前7天提醒
      if(is_vip && user.vip_surplus_day<=7){
        $('#publicModal #reBuyTrigger').trigger('click');
      }
      //不是会员
      // if(!is_vip){
      //   this.set("content","您的会员即将到期，为了不影响您的继续使用，请联系客服进行续费！");
      //   this.set("btn_tip","申请续费");
      //   this.set("btn_type","xufei");
      //   this.send("isUpdate");
      //   let hasData=this.get("update");
      //   if(!hasData){
      //     $('#public-modal-trigger').trigger('click');
      //     $.cookie('update', "update", { expires: 365,path:'/'});
      //   }
      // }

    },

    isUpdate() {

      if($.cookie('update')){

        this.set('update', $.cookie('update'));
      }else{

        this.set('update', null);
      }

    },
    clickBuy(){
      $("#buyConfirmTrigger").trigger("click");
    },
    refresh(){
      this.send("checkMember");
    }

  }
});

import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Component.extend({
  desc:"该功能需要付费会员才能使用。",
  type:"",
  actions:{
    confirm(){
      Ember.run.next(()=>{
        this.send('setType','buy');
      });
    },
    clickBuy(){
      let _this = this;
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.config.apiUrl1 + "vip/apply";
      //未登录处理
      if(this.get('type')=='needbuy'){
        let url = this.config.apiUrl1 + "vip/apply/phone?phone="+this.get('phone');
        this.set("desc","申请成功，工作人员将在2个小时联系您。请保持手机号（"+this.get('phone')+"）畅通！");
      }else{
        this.set("desc","申请成功，工作人员将在2个小时联系您。请保持手机号（"+this.get("auth").user.username+"）畅通！");
      }
      this.set("btn_tip","好的");
      this.set("type","buy");
      $('#public-modal-trigger').trigger('click');
      //购买提示
      ajax(url, {
        method: 'get'
      }).then((res) => {
        if(res.is_apply==1){
          this.set("desc","您已申请购买，请等待客服联系");
        }

      }).catch((err) => {

      });
    },
    clickModalBtn(){
      if(this.get('type') != 'buy'){
        this.send("clickBuy");
      }
    },
    setType(type){
      this.set('type',type);

      switch (type){
        case 'nobuy':
          $('#public-modal-trigger').trigger('click');
          this.set("desc","该功能需要付费会员才能使用。");
          this.set("btn_tip","申请购买");
          break;
        case 'rebuy':
          $('#public-modal-trigger').trigger('click');
          this.set("desc","您的会员即将到期，为了不影响您的继续使用，请联系客服进行续费！");
          this.set("btn_tip","申请续费");
          break;
        case 'needbuy':
          $('#public-modal-trigger').trigger('click');
          this.set("desc","您的房源已经超过100间，请升级“金水滴”会员后再继续使用！");
          this.set("btn_tip","申请购买");
          break;
        case 'buy':
          this.send("clickBuy");
          break;
      }
    }
  }
});

import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Component.extend({
  day: 15,
  didInsertElement: function () {
    // this.send("countDays");
  },

  actions: {
    alwaysAd(){
      $("#ad-trigger").trigger("click");

    },
    //取得广告并弹出
    getAd(){
      let _this = this;
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl1 + "vip/ad";
      ajax(url, {
        method: 'get',
        data: {}
      }).then((res) => {
        if (res.data.is_show == 1) {
          $("#ad-trigger").trigger("click");
        }
      }).catch((err)=> {
        $.toastr.error(err.jqXHR.responseJSON.errors.detail);
      });
      // $("#ad-trigger").trigger("click")
    },
    //临时广告
    getNewAd(){
      this.send("countDays");
      $("#ad-trigger").trigger("click");
    },
    //检测是否弹过,如果弹过则记录,否则弹出广告
    checkAd(){
      //检测cookie是否弹出过
      this.send("isAdvert");
      let hasPop = this.get("advert");
      if (!hasPop){
        $.cookie('advert', "advert", {expires: 1, path: '/'});
        this.send("getNewAd");
      }
    },
    isAdvert() {

      if ($.cookie('advert')) {
        this.set('advert', $.cookie('advert'));
      } else {
        this.set('advert', null);
      }

    },
    clickBuy(){
      $("#buyTrigger").trigger("click");
    },
    clickVip(value){

    },
    //倒数广告天数
    countDays(){
      let user = this.get("auth").user;
      let is_vip = user.vip_level > 0 ? true : false;
      //会员到期前7天提醒
      if (is_vip && user.vip_surplus_day <= 15) {
        let last_days = 32-moment().format('DD');
        this.set("day",last_days);
        this.send("checkAd");
      }
    }
  }
});

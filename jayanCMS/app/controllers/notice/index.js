import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Controller.extend({
  notices:"",
  detail:"",
  queryParams:['id'],
  actions:{
    getNotices(){

      let _this = this;
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl1 + "announcements";
      ajax(url, {
        method: 'Get'
      }).then((res) => {
        console.log(res);
        _this.set("notices", res);
      }).catch((err)=> {
        $.toastr.error("获取公告数据失败!")
      });

    },

    clickNotice(title,content,e){
      let dom = $(e.target);
      let detail = {content:content,title:title}
      this.set('detail',detail);
      $(dom).parent().addClass('active');
    },

    noticeDetail(){

    }
  }
});

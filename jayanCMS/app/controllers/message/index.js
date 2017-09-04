import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Controller.extend({
  type:"message",
  queryParams: ['created_at__gte','created_at__lte',"page","perPage"],
  page: 1,
  perPage: 15,
  actions:{
    doRead(id){
      this.store.findRecord('message', id).then(function(msg) {
        msg.set('readn', true);
        msg.save();
        $.toastr.success("标记成功")
      }).catch((err)=>{
        $.toastr.error("标记失败")
      });
    },

    doReadAll(){

      let _this = this;
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl + "messages/all_tag_readn";
      ajax(url, {
        method: 'Put'
      }).then((res)=>{
        $.toastr.success("标记成功");
        _this.send('reloadModel');
      }).catch((err)=>{
        $.toastr.error("标记失败");
      });
    }
  }
});

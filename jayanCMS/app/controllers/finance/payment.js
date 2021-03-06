import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Controller.extend({
  preType: "finance",
  detail:null,
  types:"payment",
  queryParams: ['keyword','pay_method','flow_type','trade_object','trade_at__gte','trade_at__lte','page','perPage'],
  page: 1,
  perPage: 12,
  actions: {
    pageChanged(page){
      this.set('page',page);

    },
    tabs(type){
      /*--清除保留筛选值--*/
      this.get("router").transitionTo({
        queryParams: {
          keyword:"",
          trade_at__gte:"",
          trade_at__lte:"",
          type: type,
          page: 1,
        }
      });
      $("#trade_at__gte").val("");
      $("#trade_at__lte").val("");
      $("#search").val("");

    },
    detail(id){
      let _this = this;
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl1 + "moneyflows/"+ id + '/transaction';
      ajax(url, {
        method: 'Get'
      }).then((res) => {
        _this.set("detail",res.data);
      }).catch((err)=> {

      });
    },

    financeReload(){
      this.send('reloadModel');
    }

  }
});

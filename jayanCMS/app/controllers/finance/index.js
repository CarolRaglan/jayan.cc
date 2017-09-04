import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Controller.extend({
  type: "finance",
  detail:null,
  types:"area",
  queryParams: ['keyword','city','district','block','area','house_id','trade_at__gte','trade_at__lte','fee_type_rough','fee_type','flow_type','orderby','houseText','page','perPage'],
  page: 1,
  perPage: 12,
  refresh:true,
  actions: {
    pageChanged(page){

      this.set('page',page);

    },
    detail(id){
      let _this = this;
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl1 + "moneyflows/"+ id;
      ajax(url, {
        method: 'Get'
      }).then((res) => {
        _this.set("detail",res.data);
      }).catch((err)=> {

      });
    },

    refresh(type){

      let _this = this;
      _this.set(type, false);
      Ember.run.next(function () {
        _this.set(type, true);
      });
    },
    financeReload(){
      this.send('reloadModel');
    }

  }
});

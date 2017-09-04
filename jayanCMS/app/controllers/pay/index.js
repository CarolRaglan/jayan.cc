import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Controller.extend({
  queryParams: ['contains',"pay_way","fee_type","trade_type",'page','perPage'],
  page: 1,
  perPage: 12,
  contains: "",
  pay_way:"",
  fee_type:"",
  trade_type:"",
  keyword:"",
  tipsObserver: Ember.observer('trade_type','fee_type','pay_way','contains', function () {
    this.get("router").transitionTo({
      queryParams: {
        contains: this.get('contains'),
        pay_way:this.get('pay_way'),
        fee_type:this.get('fee_type'),
        trade_type:this.get('trade_type'),
        page: 1,
      }
    })
  }),
  actions:{

    tips(type,value){
       this.set(type,value);
    },
    unbindCard(){
      this.get('auth').registerTokenToAjaxHeader();
      ajax(this.config.apiUrl1 + 'landlord/bank/card/0', {
        method: 'DELETE'
      }).then((res)=> {
        $.toastr.success("解绑成功!")
        $('#bank-card .xsd-drawer-header .xsd-modal-close').trigger("click");
        $('#delCard .xsd-modal-close').trigger("click");
        this.send('reloadModel');

      }).catch((xhr, err) => {
        $.toastr.error(xhr.jqXHR.responseJSON.errors.detail)
      });
    },
    refreshPay(){
      this.send('reloadModel');
    },
  }

});

import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Controller.extend({
  queryParams: ['page', 'pay_status', 'contract_status', 'perPage', 'start_date', 'end_date','keyword'],
  perPage: 12,
  page: 1,
  pay_status:'',
  contract_status:'',
  start_date:'',
  end_date:'',
  keyword:'',
  tipsObserver: Ember.observer('pay_status', 'contract_status', 'start_date', 'end_date','keyword', function () {
    this.get("router").transitionTo({
      queryParams: {
        pay_status: this.get('pay_status'),
        contract_status: this.get('contract_status'),
        start_date: this.get('start_date'),
        end_date: this.get('end_date'),
        keyword: this.get('keyword'),
        page: 1,
      }
    })
  }),

  actions: {


    search(type, value,e){
      if (value == 'time') {
        this.set(type, $(e.target).val());
      } else {
        this.set(type, value);
      }
    },


    detail(id){

      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl1 + "financeloans/" + id;
      ajax(url, {
        method: 'Get'
      }).then((res) => {
        this.set("detail", res.data.attributes);
      }).catch((err)=> {

      });

    },
  }


});


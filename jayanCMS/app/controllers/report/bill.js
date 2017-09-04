import Ember from 'ember';

export default Ember.Controller.extend({

  types:"bill",
  queryParams: ['start_date',"end_date","contract_start_date","contract_end_date",'status','condition', 'page','perPage'],
  page: 1,
  perPage: 12,

  actions:{
    tabs(type){
      this.get("router").transitionTo({
        queryParams: {
          condition: type,
          page: 1,
        }
      })
    },

  }

});

import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Controller.extend({

  types:"house-report",
  queryParams: ['start_date',"end_date",'rent_status','page','perPage'],
  page: 1,
  hidden:3,
  perPage: 12,

  actions:{

    downLoadReport(){

      },


  }

});

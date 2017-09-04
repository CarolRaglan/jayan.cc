import Ember from 'ember';
import RouteMixin from 'ember-cli-pagination/remote/route-mixin';

export default Ember.Route.extend(RouteMixin, {

  flag: true,
  queryParams: {

    type:{
      refreshModel:true
    },
    hidden:{
      refreshModel:true
    },
    flow_type: {
      refreshModel: true
    },
    report_type: {
      refreshModel: true
    },
    start_date: {
      refreshModel: true
    }, /*开始时间*/
    end_date: {
      refreshModel: true
    }, /*截止时间*/
    pay_method: {
      refreshModel: true
    },
    rent_extras: {
      refreshModel: true
    },
    fee_type: {
      refreshModel: true
    },
    trader_type:{
      refreshModel: true
    },
    income_type: {
      refreshModel: true
    },
    pay_type: {
      refreshModel: true
    },
    deposit_type: {
      refreshModel: true
    },
    page: {
      refreshModel: true,
    },

  },

  beforeModel: function (queryParams) {

    if (this.get("flag")) {

      // this.get("router").transitionTo({
      //   queryParams: {
      //     report_type: "day",
      //     start_date: "",
      //     end_date: "",
      //     pay_method: "",
      //     rent_extras:"",
      //     fee_type: "",
      //     trader_type:"",
      //     income_type: "",
      //     pay_type: "",
      //     deposit_type:"",
      //     flow_type:"",
      //     page: 1,
      //   }
      // });
      this.set("flag", false);
    }
  },

  resetController(controller, isExiting, transition){

    if (isExiting) {
      controller.set('type', 3);
      controller.set('report_type', "day");
      controller.set('flow_type', "");
      controller.set('start_date', "");
      controller.set('end_date', "");
      controller.set('pay_method', "");
      controller.set('rent_extras', "");
      controller.set('fee_type', "");
      controller.set('trader_type', "");
      controller.set('income_type', "");
      controller.set('pay_type', "");
      controller.set('deposit_type', "");
      controller.set('page', 1);
      controller.set("hidden","");

    }
  },

  afterModel: function (model) {
    // document.title = "登录注册";
  },
  model(params){

    // if (params.type == 3) {
    //
    //   delete params.type;
    //   delete params.flow_type;
    //   delete params.pay_method;
    //   delete params.rent_extras;
    //   delete params.fee_type;
    //   delete params.trader_type;
    //   delete params.income_type;
    //   delete params.pay_type;
    //   delete params.deposit_type;
    //
    //   params.paramMapping = {
    //     page: "page",
    //     perPage: 'page_size'
    //   };
    //   return this.findPaged('report', params);
    // } else {

      params.paramMapping = {
        page: "page",
        perPage: 'page_size'
      };
      return this.findPaged('rundetail', params);
    // }

  },


  setupController(controller, model, queryParams){

    this._super(controller, model);
    controller.set("tips", "filter");
    Ember.run.later(function(){

    switch(controller.type){
      case 0:
        $('#tab-income-trigger').trigger("click");
        break;
      case 1:
        $('#tab-pay-trigger').trigger("click");
        break;
      case 2:
        $('#tab-include-trigger').trigger("click");
        break;
    }
    }.bind(this),0);

  },

});

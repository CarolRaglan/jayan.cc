import Ember from 'ember';
import RouteMixin from 'ember-cli-pagination/remote/route-mixin';


export default Ember.Route.extend(RouteMixin, {
  flag:true,
  queryParams: {

    contains:{
      refreshModel: true
    },
    pay_way:{
      refreshModel: true
    },
    fee_type:{
      refreshModel: true
    },
    trade_type:{
      refreshModel: true
    },

    page:{
      refreshModel: true,
    }
  },
  //
  beforeModel: function (queryParams) {

    if(this.get("flag")){

        this.get("router").transitionTo({queryParams: {
          contains: "",
          pay_way:"",
          fee_type:"",
          trade_type:"",
          page:1,
        }});
        this.set("flag",false);
      }
  },

  resetController(controller, isExiting, transition) {

    if (isExiting) {

      controller.set('contains', "");
      controller.set('pay_way', "");
      controller.set('fee_type', "");
      controller.set('trade_type', "");
    }
  },

  afterModel: function (model) {
    // document.title = "登录注册";
  },
  model(params){

    params.paramMapping = {
      page: "page",
      perPage: 'page_size',
    };
    return this.findPaged('h2ometrade', params);
  },

  setupController(controller, model, queryParams) {

    this._super(controller, model);
  },

  actions: {

    reloadModel: function() {
      this.refresh()
    }
  }
});

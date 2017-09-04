import Ember from 'ember';
import RouteMixin from 'ember-cli-pagination/remote/route-mixin';

export default Ember.Route.extend(RouteMixin,{

  flag:true,
  queryParams:{

    keyword:{
      refreshModel: true
    },
    created_at__gte:{
      refreshModel: true
    },
    created_at__lte:{
      refreshModel: true
    },
    page:{
      refreshModel: true
    },
    account_type:{
      refreshModel: true
    },
    role_name:{
      refreshModel: true
    },
  },
  //
  beforeModel: function () {

    if(this.get("flag")){

      this.get("router").transitionTo({queryParams: {
        keyword: "",
        account_type: "",
        role_name: "",
        created_at__gte:"",
        created_at__lte:""
      }});
      this.set("flag",false);
    }

  },

  resetController(controller, isExiting, transition) {
    if (isExiting) {

      controller.set('keyword', "");
      controller.set('account_type', "");
      controller.set('role_name', "");
      controller.set('created_at__gte', "");
      controller.set('created_at__lte', "");
    }
  },

  afterModel: function(model) {


  },
  model(params){

    params.paramMapping = {
      page: "page",
      perPage: 'page_size'
    };
    return this.findPaged('employer', params);
  },

  setupController(controller, model) {

    this._super(controller, model);

  },

  actions: {

    reloadModel: function() {
      this.refresh()
    }
  }
});

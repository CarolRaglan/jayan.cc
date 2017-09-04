import Ember from 'ember';
import RouteMixin from 'ember-cli-pagination/remote/route-mixin';

export default Ember.Route.extend(RouteMixin,{

  flag:true,
  queryParams: {

    start_date:{
      refreshModel: true
    },
    end_date:{
      refreshModel: true
    },
    rent_status:{
      refreshModel: true
    },
    page:{
      refreshModel: true,
    }

  },

  beforeModel: function (queryParams){

    if(this.get("flag")){

      this.get("router").transitionTo({queryParams:{
        start_date:"",
        end_date:"",
        rent_status:"",
        page:1,
      }});
      this.set("flag",false);
    }
  },

  resetController(controller, isExiting, transition){

    if (isExiting) {

      controller.set('start_date',"");
      controller.set('end_date',"");
      controller.set('rent_status',"");
      controller.set('page', 1);
    }
  },

  afterModel: function (model){
    // document.title = "登录注册";
  },
  model(params){

    params.paramMapping = {
      page: "page",
      perPage: 'page_size',
    };
    return this.findPaged('housereport', params);
  },

  setupController(controller, model, queryParams){

    this._super(controller, model);

  },

});

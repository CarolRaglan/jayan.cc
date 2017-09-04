import Ember from 'ember';
import RouteMixin from 'ember-cli-pagination/remote/route-mixin';

export default Ember.Route.extend(RouteMixin,{

  flag:true,
  queryParams:{

    created_at__gte:{
      refreshModel: true
    },
    created_at__lte:{
      refreshModel: true
    },
    page:{
      refreshModel: true,
    }
  },

  beforeModel:function () {

    if(this.get("flag")){

      this.get("router").transitionTo({queryParams: {
        created_at__gte:"",
        created_at__lte:"",
        page:1
      }});
      this.set("flag",false);
    }
  },

  afterModel: function(model) {

    // document.title = "登录注册";
  },
  model(params){
    params.paramMapping = {
      page: "page",
      perPage: 'page_size'
    };
    return this.findPaged('message', params);
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

import Ember from 'ember';
import ajax from 'ic-ajax';
import RouteMixin from 'ember-cli-pagination/remote/route-mixin';

export default Ember.Route.extend(RouteMixin,{
  flag:true,
  queryParams: {

    pay_status:{

      refreshModel: true
    },
    contract_status:{

      refreshModel: true,
    },
    page:{

      refreshModel: true,
    },
    start_date:{

      refreshModel: true,
    },
    end_date:{

      refreshModel: true,
    },
    keyword:{

      refreshModel: true,
    },
  },

  beforeModel: function (queryParams) {

    if(this.get("flag")){

      this.get("router").transitionTo({queryParams: {
        pay_status:"",
        contract_status:"",
        page:1,
        start_date:'',
        end_date:'',
        keyword:'',
      }});
      this.set("flag",false);
    }
  },

  resetController(controller, isExiting, transition) {

    if (isExiting) {

      controller.set('pay_status', "");
      controller.set('contract_status', "");
      controller.set('page',1);
      controller.set('start_date',"");
      controller.set('end_date',"");
      controller.set('keyword',"");
    }
  },

  afterModel: function (model) {

  },
  model(params){


    params.paramMapping = {
      page: "page",
      perPage: 'page_size',
    };
    return this.findPaged('financeloan', params);
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

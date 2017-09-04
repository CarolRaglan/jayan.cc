import Ember from 'ember';
import ajax from 'ic-ajax';
import RouteMixin from 'ember-cli-pagination/remote/route-mixin';

export default Ember.Route.extend(RouteMixin,{
  flag:true,
  queryParams: {

    title:{

      refreshModel: true
    },
    server:{

      refreshModel: true,
    },
    page:{

      refreshModel: true,
    },
    status:{

      refreshModel: true,
    },
    source:{

      refreshModel: true,
    },
    urgency:{

      refreshModel: true,
    },
    start_date:{

      refreshModel: true,
    },
    end_date:{

      refreshModel: true,
    },
    search:{

      refreshModel: true,
    },
  },

  beforeModel: function (queryParams) {

    if(this.get("flag")){

      this.get("router").transitionTo({queryParams: {
        title:1,
        server:0,
        page:1,
        status:'',
        source:'',
        urgency:'',
        start_date:'',
        end_date:'',
        search:'',

      }});
      this.set("flag",false);
    }
  },

  resetController(controller, isExiting, transition) {

    if (isExiting) {

      controller.set('title', 1);
      controller.set('server', 0);
      controller.set('page',1);
      controller.set('status',"");
      controller.set('source',"");
      controller.set('urgency',"");
      controller.set('start_date',"");
      controller.set('end_date',"");
      controller.set('search',"");

    }
  },

  afterModel: function (model) {

  },
  model(params){

    params.paramMapping = {
      page: "page",
      perPage: 'page_size',
    };
    return this.findPaged('customer', params);
  },

  setupController(controller, model, queryParams) {

    this._super(controller, model);
    this.get('auth').registerTokenToAjaxHeader();
    let url = this.get("config").apiUrl+ "operators";
    ajax(url, {
      method: 'Get',
      async: false,
    }).then((res) => {
      controller.set("employers", res.data.attributes);
    }).catch((err)=> {
      $.toastr.error("服务器出错!");
    });
  },

  actions: {

    reloadModel: function() {
      this.refresh()
    }
  }


});

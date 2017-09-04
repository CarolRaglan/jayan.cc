import Ember from 'ember';
import RouteMixin from 'ember-cli-pagination/remote/route-mixin';


export default Ember.Route.extend(RouteMixin, {
  flag:true,
  queryParams: {

    keyword:{
      refreshModel: true
    },
    city:{
      refreshModel: true
    },
    district:{
      refreshModel: true
    },
    block:{
      refreshModel: true
    },
    area:{
      refreshModel: true
    },
    house_id:{
      refreshModel: true
    },
    trade_at__gte:{
      refreshModel: true
    },
    trade_at__lte:{
      refreshModel: true
    },
    fee_type_rough:{
      refreshModel: true
    },
    fee_type:{
      refreshModel: true
    },
    flow_type:{
      refreshModel: true
    },
    orderby:{
      refreshModel: true
    },
    houseText:{
      refreshModel: false
    },
    page:{
      refreshModel: true,
    }
  },
  //
  beforeModel: function (queryParams) {

    if(this.get("flag")){

      //from report
      if(queryParams.queryParams.houseText=="report"){

        this.get("router").transitionTo({queryParams: {

          trade_at__gte:queryParams.queryParams.trade_at__gte,
          trade_at__lte:queryParams.queryParams.trade_at__lte,
          fee_type_rough:queryParams.queryParams.fee_type_rough,
          fee_type:queryParams.queryParams.fee_type,
          houseText:"",
          page:1,
        }});

      }else{

      this.get("router").transitionTo({queryParams: {
        keyword: "",
        district:"",
        block:"",
        area:"",
        house_id:"",
        trade_at__gte:"",
        trade_at__lte:"",
        fee_type_rough:"",
        fee_type:"",
        flow_type:"",
        page:1,
      }});
      this.set("flag",false);
    }
    }
  },

  resetController(controller, isExiting, transition) {

    if (isExiting) {

      controller.set('keyword', "");
      controller.set('district', "");
      controller.set('block', "");
      controller.set('area', "");
      controller.set('house_id', "");
      controller.set('houseText', "");
      controller.set('trade_at__gte', "");
      controller.set('trade_at__lte', "");
      controller.set('fee_type_rough', "");
      controller.set('fee_type', "");
      controller.set('flow_type', "");
      controller.set('orderby', "-trade_at");
    }
  },

  afterModel: function (model) {
    // document.title = "登录注册";
  },
  model(params){
    // return this.findPaged("moneyflow",params);
    // return this.store.query('moneyflow',{
    //   page_size:5,
    //   page:1
    // })
    params.paramMapping = {
      page: "page",
      perPage: 'page_size',
      orderby:'-trade_at',
    };
    return this.findPaged('moneyflow', params);
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

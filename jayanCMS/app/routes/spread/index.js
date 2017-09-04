import Ember from 'ember';
import ajax from 'ic-ajax';
import RouteMixin from 'ember-cli-pagination/remote/route-mixin';

export default Ember.Route.extend(RouteMixin,{

  flag:true,
  queryParams:{
    //参数
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
    house_num:{
      refreshModel: true
    },
    is_whole:{
      refreshModel: true
    },
    status:{
      refreshModel: true
    },
    channel:{
      refreshModel: true
    },
    page:{
      refreshModel: true,
    }

  },
  //model加载前
  beforeModel: function (queryParams){

    this.store.unloadAll('showroom');
    if(this.get("flag")){

      this.get("router").transitionTo({queryParams: {
        keyword: "",
        city:"",
        district:"",
        block:"",
        area:"",
        house_num:"",
        is_whole:"",
        channel:'',
        status:0,
        page:1,
      }});
      this.set("flag",false);
    }
  },

  resetController(controller, isExiting, transition) {

    if (isExiting) {

      controller.set('city', "");
      controller.set('keyword', "");
      controller.set('district', "");
      controller.set('block', "");
      controller.set('area', "");
      controller.set('house_num', "");
      controller.set('is_whole', "");
      controller.set('channel', "");
      controller.set('status', 0);
      controller.set('page', 1);
      controller.set('flag', false);
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

    return this.findPaged('showroom',params)
  },

  setupController(controller, model){
    this._super(controller, model);
    this.get('auth').registerTokenToAjaxHeader();
    let url = this.get("config").apiUrl1 + "openchannels/apply";
    ajax(url, {
      method: 'GET',
      async:false,
    }).then((res) => {
      this.controller.set("app_status",res.status);

    }).catch((err)=> {
      $.toastr.error("获取出房权限出错!请联系客服!");
    });

  },
  actions: {

    reloadModel: function(){
      this.refresh()
    }
  }
});

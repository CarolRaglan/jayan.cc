import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Route.extend({

  flag:true,
  queryParams: {

    date:{
      refreshModel:true
    },
    page:{
      refreshModel: true,
    }

  },
  beforeModel: function (queryParams){

    if(this.get("flag")){

      this.get("router").transitionTo({queryParams:{
        date:"",
        page:1,
      }});
      this.set("flag",false);
    }
  },

  resetController(controller, isExiting, transition){
    if (isExiting) {
      controller.set('date',"");
      controller.set('page', 1);
    }
  },

  afterModel: function (model){
    // document.title = "登录注册";
  },

  model(params){
    this.get('auth').registerTokenToAjaxHeader();
    let url = this.get("config").apiUrl1 + "monthreports?date="+params.date;
    ajax(url, {
      method: 'GET'
    }).then((res) => {
      this.controller.set("monthReports",res);
    }).catch((err)=> {

    });

  },
  setupController(controller, model,queryParams){
    this._super(controller, model,queryParams);
  },
});

import Ember from 'ember';
// import LazyRouteMixin from 'ember-cli-lazy-load/mixins/lazy-route';

export default Ember.Route.extend({

  queryParams:{

    target:{
      refreshModel: false
    }

  },

  // beforeModel: function (transition, queryParams) {
  //   return this._super(transition, queryParams).then(()=>{
  //     //code after the bundle load
  //     console.log("登录注册加载完毕");
  //   });
  // },

  resetController(controller, isExiting, transition) {
    if (isExiting) {
      // isExiting would be false if only the route's model was changing
      controller.set('target', "login");
    }
  },

  afterModel: function(model) {

   // document.title = "登录注册";
  },
  model(params){
    // console.log(params.target);
  },

  setupController(controller, model, queryParams) {
    //已登录跳转
    // this.transitionTo('index');

    this._super(controller, model);
    if(queryParams.queryParams.target===undefined||queryParams.queryParams.target===""){
      controller.set("target","login");
    }

  },
  withLayout: false
});

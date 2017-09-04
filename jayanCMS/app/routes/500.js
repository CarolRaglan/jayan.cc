import Ember from 'ember';

export default Ember.Route.extend({

  model(){

    if(this.get("config").environment ==='dev'){
      return "/";
    }else{
      return "http://www.shuidiguanjia.com";
    }

  },
  withLayout: false
});

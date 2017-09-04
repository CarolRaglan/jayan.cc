import Ember from 'ember';

export default Ember.Route.extend({

  beforeModel(){
    let user = $.cookie('user'),
      token = $.cookie('token');

    if (user === undefined && token === undefined) {
      this.get("router").transitionTo("/user/sign");
    }
  }

});

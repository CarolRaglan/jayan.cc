// @Deprecated v4.0.7
import Ember from 'ember';

export default Ember.Route.extend({

  model(){

  },

  beforeModel() {
    this.transitionTo('/uc/settings/account');
  }

});

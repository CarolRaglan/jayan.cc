import Ember from 'ember';

export default Ember.Route.extend({

  afterModel(controller, model){
    $("#nav-side-statistic").trigger("click");
  }

});

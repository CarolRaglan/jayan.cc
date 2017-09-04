import Ember from 'ember';

export default Ember.Controller.extend({

  types:"month-report",
  queryParams: ['date','page'],
  page:1,
});

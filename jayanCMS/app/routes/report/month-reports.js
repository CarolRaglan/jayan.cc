import Ember from 'ember';

export default Ember.Route.extend({
  afterModel(controller, model, queryParams){
    $("#nav-side-report").trigger("click");
    Ember.run.later(function(){
      let time=moment().add('months',-1).format('YYYY-MM').split("-");
      let year=time[0];
      let month=time[1];
      $("#month_select_year").attr("data-value",year).val(year+"年");
      $("#month_select_month").attr("data-value",month).val(month+"月");
      $('#month_select_year').change();

    }.bind(this),0);

  },
  setupController(controller, model, queryParams) {

    this._super(controller, model);

  }


});

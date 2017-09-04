import Ember from 'ember';
export default Ember.Route.extend({
  afterModel(controller, model, queryParams){
    // 设置日报表默认时间  页面渲染后执行
    $("#nav-side-report").trigger("click");
    Ember.run.later(function(){
      let time=moment().subtract(1,'days').format('YYYY-MM-DD').split("-");
      let year=time[0];
      let month=time[1];
      let day=time[2];
      $("#day_select_year").attr("data-value",year).val(year+"年");
      $("#day_select_month").attr("data-value",month).val(month+"月");
      $("#month-report-list").children("li").eq(month-1).trigger("click");
      $("#day_select_day").attr("data-value",day).val(day+"日");
      $("#day_report_btn").trigger("click");
      $('#day_select_year').change();

    }.bind(this),0);
  },
  setupController(controller, model, queryParams) {

    this._super(controller, model);

  }

});

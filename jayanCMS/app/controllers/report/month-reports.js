import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Controller.extend({
  month_report_month:null,
  month_report:null,
  types:"month-reports",
  start_date:"",
  hidden:1,
  actions:{
    daySetTime(){

    },
    getMonthReport(){
      let year=$("#month_select_year").attr("data-value");
      let month=$("#month_select_month").attr("data-value");
      let url = this.config.apiUrl1 + "monthreports";
      let _this=this;
      this.set("month_report_month",month);
      this.set("start_date",year+"-"+month);
      this.get('auth').registerTokenToAjaxHeader();
      ajax(url, {
        data: {
          "date": year+"-"+month
        },
        method: 'get'
      }).then((res) => {
        _this.send("isEmptyObject",res)
      }).catch((err) => {
        $.toastr.error(err.jqXHR.responseJSON.errors.detail);
      });
    },
    isEmptyObject(obj) {
      this.set("month_report", false);
      for (var key in obj) {
        this.set("month_report", obj);
      }
    }
  }
});

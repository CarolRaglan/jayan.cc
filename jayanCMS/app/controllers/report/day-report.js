import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Controller.extend({
  day_report_month: null,
  day_report_day: null,
  day_report: null,
  hidden: 1,
  month_select_day:'',
  month_select_days:'',
  year_select_day:'',
  start_date: "",
  types: "day-report",

  actions: {

    getDayReport(){

      let year = $("#day_select_year").attr("data-value");
      let month = $("#day_select_month").attr("data-value");
      let day = $("#day_select_day").attr("data-value");
      let url = this.config.apiUrl1 + "dailyreports";
      let _this = this;
      this.set("day_report_month", month);
      this.set("day_report_day", day);
      this.set("start_date", year + "-" + month + "-" + day);
      this.get('auth').registerTokenToAjaxHeader();
      ajax(url, {
        data: {
          "date": year + "-" + month + "-" + day
        },
        method: 'get'
      }).then((res) => {
        _this.send("isEmptyObject",res);
      }).catch((err) => {
        $.toastr.error(err.jqXHR.responseJSON.errors.detail);
      });
    },
    isEmptyObject(obj) {
      this.set("day_report", false);
      for (var key in obj) {
        this.set("day_report", obj);
      }
    },
    selectTime(month){
      let years = parseInt($("#day_select_year").attr("data-value"));
      $("#day_select_day").attr("data-value","1").val("1日");
      if(month=="3"){
        this.set("month_select_day",false);
        this.set("year_select_day",false);
      }else{
        this.set("month_select_day",true);
        this.set("year_select_day",true);
      }
      if(month=="2"){
        this.set("month_select_days",false)
      }else{
        this.set("month_select_days",true);
      }
      if(((years%4==0)&&(years%100!=0))||(years%400==0)){
        if(month=="3"){
          this.set("year_select_day",true);
        }
      }
    }
  //   YYYYMMDDstart(){
  //     MonHead = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  //     var y = new Date().getFullYear();
  //     for (var i = (y - 30); i < (y + 30); i++)
  //       document.reg_testdate.YYYY.options.add(new Option(" " + i + " 年", i));
  //     for (var i = 1; i < 13; i++)
  //       document.reg_testdate.MM.options.add(new Option(" " + i + " 月", i));
  //     document.reg_testdate.YYYY.value = y;
  //     document.reg_testdate.MM.value = new Date().getMonth() + 1;
  //     var n = MonHead[new Date().getMonth()];
  //     if (new Date().getMonth() == 1 && this.send("IsPinYear","YYYYvalue")) n++;
  //     this.send("writeDay", "n"); //赋日期下拉框Author:meizz
  //     document.reg_testdate.DD.value = new Date().getDate();
  //     alert("日期")
  //   },
  //   addEvent(){
  //     if (document.attachEvent)
  //       window.attachEvent("onload", this.send("YYYYMMDDstart"));
  //     else
  //       window.addEventListener('load', this.send("YYYYMMDDstart"), false);
  //   },
  //   YYYYDD(str){//年发生变化时日期发生变化(主要是判断闰平年)
  //     this.send("addEvent");
  //     var MMvalue = document.reg_testdate.MM.options[document.reg_testdate.MM.selectedIndex].value;
  //     if (MMvalue == "") {
  //       var e = document.reg_testdate.DD;
  //       this.send("optionsClear",e);
  //       return;
  //     }
  //     var n = MonHead[MMvalue - 1];
  //     if (MMvalue == 2 && this.send("IsPinYear",str)) n++;
  //     this.send("writeDay", "n");
  //   },
  //   MMDD(str){//月发生变化时日期联动
  //     var YYYYvalue = document.reg_testdate.YYYY.options[document.reg_testdate.YYYY.selectedIndex].value;
  //     if (YYYYvalue == "") {
  //       var e = document.reg_testdate.DD;
  //       this.send("optionsClear",e);
  //       return;
  //     }
  //     var n = MonHead[str - 1];
  //     if (str == 2 && this.send("IsPinYear",YYYYvalue)) n++;
  //     this.send("writeDay", "n");
  //   },
  //   writeDay(n){//据条件写日期的下拉框
  //     var e = document.reg_testdate.DD;
  //     this.send("optionsClear",e);
  //     for (var i = 1; i < (n + 1); i++)
  //       e.options.add(new Option(" " + i + " 日", i));
  //   },
  //   IsPinYear(year){    //判断是否闰平年
  //     return (0 == year % 4 && (year % 100 != 0 || year % 400 == 0));
  //   },
  //   optionsClear(e){
  //     e.options.length = 1;
  //   }
   }


});

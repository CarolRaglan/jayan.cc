/*
 * 书写人:jo.li
 * 说明:首页数据统计模块统计代码
 * */
import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Component.extend({

  dataFlag: true,
  exist:"",
  profit: {
    "incomes_thismonth": 0,
    "incomes_thisseason": 0,
    "incomes_thisweek": 0
  },
  rentRoomNum: "",
  mapCount: "",
  roomCount: {
    "occupancy_rate": 0,
    "eviction_rate": 0,
    "renew_rate": 0,
    "gross_profit_rate": 0
  },
  monthCount_data: {
    "all_room_contract_nums": 0,
    "done_house_order_nums": 0,
    "done_house_contract_nums": 0,
    "all_room_order_nums": 0,
    "done_house_order_amount": 0,
    "done_room_contract_nums": 0,
    "all_room_order_amount": 0,
    "done_room_order_nums": 0,
    "all_house_contract_nums": 0,
    "all_house_order_amount": 0,
    "done_room_order_amount": 0,
    "all_house_order_nums": 0
  },
  colspan: 3,
  start_time:"",
  end_time:"",
  screenOrigin:"",
  didRender: function () {

    if (this.get("dataFlag")) {
      this.send("monthCount", "last_month");
      this.set("dataFlag", false);
    }

  },
  didInsertElement: function () {

      /*---------筛选日历控件---------*/
     var picker1 = new Pikaday(
      {
        field: document.getElementById('search_start_time'),
        firstDay: 1,
        minDate: new Date(2000, 0, 1),
        maxDate: new Date(2020, 12, 31),
        yearRange: [2000, 2020],
        format:"YYYY.MM.DD",
        bound: false,
        container: document.getElementById('screen-container1'),
      });
     var picker2 = new Pikaday(
      {
        field: document.getElementById('search_end_time'),
        firstDay: 1,
        minDate: new Date(2000, 0, 1),
        maxDate: new Date(2020, 12, 31),
        yearRange: [2000, 2020],
        format:"YYYY.MM.DD",
        bound: false,
        container: document.getElementById('screen-container2'),
      });
    /*----------嘀嗒贷---------*/
    if (this.get("auth").user.role == "boss") {

      this.set("colspan", 2);
    }
    let _this = this;

    this.get('auth').registerTokenToAjaxHeader();
    let url4 = this.get("config").apiUrl1 + "shuididai/info";

    ajax(url4, {
      method: 'Get',

    }).then((res) => {
      _this.set("loan", res);
    }).catch((err)=> {

      $.toastr.error("获取嘀嗒贷数据失败!")
    });

    /*----------有无房源判断---------*/
    this.get('auth').registerTokenToAjaxHeader();
    let url_exist = this.get("config").apiUrl + "houses/exist";

    ajax(url_exist, {
      method: 'Get',

    }).then((res) => {
      _this.set("exist", res.data.attributes.exist);
    }).catch((err)=> {

      // $.toastr.error("服务器错误!")
    });

    /*----------近期盈利统计---------*/
    _this.send("obtainInOut")

    /*----------合同,账单数据统计---------*/

    $("#monthCountTips li").click(function () {

      let month = $(this).attr("data-month");
      _this.send("monthCount", month);
    })

    /*----------经营数据统计---------*/
    let url3 = this.get("config").apiUrl1 + "rateinfo";

    ajax(url3, {
      method: 'Get',
    }).then((res) => {

      _this.set("mapCount", res);
      _this.set("rentRoomNum", (res.all_room_nums - res.vacancy_room_nums));
      let roomCount = {
        "occupancy_rate": res.occupancy_rate * 100,
        "eviction_rate": res.eviction_rate * 100,
        "renew_rate": res.renew_rate * 100,
        "gross_profit_rate": res.gross_profit_rate * 100
      };
      _this.set("roomCount", roomCount);
      let color1, color2, color3, color4;
      if (roomCount.occupancy_rate > 90) {
        color1 = "#56cc8d";
      } else if (80 <= roomCount.occupancy_rate && roomCount.occupancy_rate <= 90) {
        color1 = "#ffae53";
      } else {
        color1 = "#ff7f66";
      }

      if (roomCount.eviction_rate < 20) {
        color2 = "#56cc8d";
      } else if (20 <= roomCount.eviction_rate && roomCount.eviction_rate <= 50) {
        color2 = "#ffae53";
      } else {
        color2 = "#ff7f66";
      }

      if (roomCount.renew_rate > 80) {

        color3 = "#56cc8d";
      } else if (60 <= roomCount.renew_rate && roomCount.renew_rate <= 80) {

        color3 = "#ffae53";
      } else {

        color3 = "#ff7f66";
      }

      if (roomCount.gross_profit_rate > 30) {

        color4 = "#56cc8d";
      } else if (15 <= roomCount.gross_profit_rate && roomCount.gross_profit_rate <= 30) {

        color4 = "#ffae53";
      } else {

        color4 = "#ff7f66";
      }
      echarts.init(document.getElementById('check')).setOption(initCharts(color1, roomCount.occupancy_rate));
      echarts.init(document.getElementById('lease')).setOption(initCharts(color2, roomCount.eviction_rate));
      echarts.init(document.getElementById('renew')).setOption(initCharts(color3, roomCount.renew_rate));
      echarts.init(document.getElementById('gross')).setOption(initCharts(color4, roomCount.gross_profit_rate));
    }).catch((err)=> {
      // $.toastr.error("获取经营数据失败!")
    });

    function initCharts(color, data) {
      let labelFromatter = {
        normal: {
          color: color,
          label: {
            formatter: function (params) {
              return 100 - Math.round(params.value * 100 / 100) + '%'
            },
            textStyle: {
              baseline: 'center',
              color: "#666666",
              fontSize: 20
            }
          }
        },
      };

      let labelBottom = {
        normal: {
          color: '#e7e7e7',
          label: {
            show: true,
            position: 'center'
          },
          labelLine: {
            show: false
          }
        },
        emphasis: {
          color: 'rgba(0,0,0,0)'
        }
      };
      let labelTop = {
        normal: {
          label: {
            show: false,
            position: 'center',
            textStyle: {
              baseline: 'bottom'
            }
          },
          labelLine: {
            show: false
          }
        }
      };
      let radius = [50, 46];

      let option = {

        series: [
          {
            type: 'pie',
            center: ['50%', '50%'],
            radius: radius,
            x: '0%', // for funnel
            itemStyle: labelFromatter,
            data: [
              {name: 'other', value: 100 - data, itemStyle: labelBottom},
              {name: 'occupancy_rate', value: data, itemStyle: labelTop}
            ]
          },
        ]
      };
      return option;
    };
  },

  actions: {

    popPicker(screenOrigin,date1,date2,e){

      this.set("screenOrigin",screenOrigin);
      this.set("start_time",date1);
      this.set("end_time",date2);
      $("#screenTime").css({"left":e.pageX-550+"px","top":e.pageY+18+"px"}).fadeIn();

    },

    closePicker(){

      $("#screenTime").fadeOut();
    },

    confirmPicker(){

     if(this.get("screenOrigin")){

       this.send("obtainInOut",this.get("start_time"),this.get("end_time"));
     }else{

       this.send("monthCount",this.get("start_time"),this.get("end_time"));
     }
      this.send("closePicker")
    },

    //获取收支情况
    obtainInOut(start_date,end_date){

      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl1 + "orderflowviews/in_out";

      ajax(url, {
        method: 'Get',
        data: {
          start_date: start_date,
          end_date: end_date
        }
      }).then((res) => {
        this.set("profit", res);
      }).catch((err)=> {

        $.toastr.error("获取收支数据失败!")
      });

    },

    //经营状况
    monthCount(start_date,end_date){

      let _this = this;
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl1 + "monthcount";

      ajax(url, {
        method: 'Get',
        data: {
          start_date: start_date,
          end_date: end_date
        }

      }).then((res) => {

        _this.set("monthCount_data", res);
        _this.send("barChart", res);

      }).catch((err)=> {

        // $.toastr.error("获取合同统计数据失败!")

      });
    },

    //获取历史账单历史合同
    getHistroy(start_date,end_date,type){

      this.sendAction("getHistroy",start_date,end_date,type);
    },

    barChart(data){

      let count = 0;
      let num = 200;
      $("#monthCount li p").each(function (i) {

        switch (i) {

          case 0:
          {

            if (data.all_house_contract_nums == 0) {
              count = 0;
            } else {
              count = (data.done_house_contract_nums / data.all_house_contract_nums).toFixed(2) * num;
            }

            break;
          }
          case 1:
          {

            if (data.all_room_contract_nums == 0) {
              count = 0;
            } else {
              count = (data.done_room_contract_nums / data.all_room_contract_nums).toFixed(2) * num;
            }

            break;

          }
          case 2:
          {

            if (data.all_house_order_nums == 0) {
              count = 0;
            } else {
              count = (data.done_house_order_nums / data.all_house_order_nums).toFixed(2) * num;
            }
            break;

          }
          case 3:
          {

            if (data.all_room_order_nums == 0) {
              count = 0;
            } else {
              count = (data.done_room_order_nums / data.all_room_order_nums).toFixed(2) * num;
            }
            break;

          }
          case 4:
          {

            if (data.all_house_order_amount == 0) {
              count = 0;
            } else {
              count = (data.done_house_order_amount / data.all_house_order_amount).toFixed(2) * num;
            }
            break;

          }
          case 5:
          {

            if (data.all_room_order_amount == 0) {
              count = 0;
            } else {
              count = (data.done_room_order_amount / data.all_room_order_amount).toFixed(2) * num;
            }
            break;

          }
        }
        $(this).animate({width: count + "px"}, 1000);

      })

    },

    nopower(flag){
      if(flag){

        $.toastr.error("抱歉!您没有该权限!")
      }else{
        $.toastr.error("抱歉!您还没有房源,请先添加房源!")
      }

    }
  }
});

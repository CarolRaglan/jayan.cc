import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Route.extend({

  afterModel(controller, model){
    $("#nav-side-statistic").trigger("click");

    const _this = this;
    const colorArray = ['#54ce8f', '#ff7c63', '#feae4b'];

    Object.values = function (obj) {
      let vals = [];
      for(let key in obj ) {
        if ( obj.hasOwnProperty(key) ) {
          vals.push(obj[key]);
        }
      }
      return vals;
    };

    let a = {
      b: {c: 0},
      e: {d: 1}
    };
    function objectMerge(object) {
      let newObject = {};
      $.each(object, function(name, value) {
        $.extend(newObject, value);
      });
      return newObject;
    }

    // DOM 渲染完毕后立即执行
    Ember.run.later(function(){
      // 概况部分
      let flag = false;
      $('.chart-tab span').on('click', function(){
        $('.chart-tab span').removeClass('active');
        $(this).addClass('active');
        let daily = $(this).hasClass('daily') ? 1 : 0;
        _this.get('auth').registerTokenToAjaxHeader();
        let url = _this.get("config").apiUrl1 + 'statistics/operations?is_day=' + daily;
        ajax(url, {
          method: 'GET',
          async: false,
        }).then((res) => {
          $('.val-1').text(res.new_contract);
          $('.val-2').text(res.renew_contract);
          $('.val-3').text(res.unrent_contract);
          $('.val-4').text(res.yet_receive);
          $('.val-5').text(res.wait_receive);
          !flag && render(res);
          flag = true;
        }).catch((err)=> {
          $.toastr.error("获取运营统计权限出错!请联系客服!");
        });
      });
      $('.chart-tab .month').trigger('click');
    }.bind(this), 0);

    // 渲染图表
    function render(data) {
      if (!$('.chart-box-content').length) {
        return false;
      }

      let option1 = {
        color: ['#74b9ff'],
        tooltip: {
          trigger: "item",
          formatter: "{a}:{c}%"
        },
        legend: {
          x: 'center',
          data: ["入住率"]
        },
        grid: {
          x: 40,
          y: 50,
          x2: 40,
          y2: 50,
          borderWidth: 0,
        },
        xAxis: [
          {
            splitLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                color: '#ddd',
                width: 1,
                type: 'solid'
              }
            },
            type: "category",
            data: Object.keys(objectMerge(data.occupancy_rate))
          }
        ],
        yAxis: [
          {
            splitLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                color: '#ddd',
                width: 1,
                type: 'solid'
              }
            },

          }
        ],
        series: [
          {
            name: "入住率",
            type: "line",
            data: Object.values(objectMerge(data.occupancy_rate))

          },
        ]
      };

      let option2 = {
        color: colorArray,
        tooltip : {
          trigger: 'item',
          formatter: "{b}:{c}({d}%)"
        },
        legend: {
          orient : 'horizontal',
          x : 'center',
          data:['到期退租','中途退租']
        },
        calculable : false,
        series : [
          {
            center : ['30%', '60%'],
            type:'pie',
            radius : [50, 60],
            itemStyle :　{
              normal : {
                label : {
                  show : true,
                  textStyle : {
                    color : '#666666',
                    fontFamily : 'Verdana',
                    fontSize : 14,
                  },
                  formatter: function(params){
                    if (Math.round(params.percent) == 0)
                      return '';
                    return Math.round(params.percent) + '%';
                  }
                },
                labelLine : {
                  show : false,
                  length: 0
                }
              },
            },
            data:[
              {value: data.normal_unrent, name: '到期退租'},
              {value: data.unnormal_unrent, name: '中途退租'},
            ]
          }
        ]
      };

      let option3 = {
        color: colorArray,
        tooltip : {
          trigger: 'item',
          formatter: "{a}:{c}"
        },
        legend: {
          x: 'center',
          data:['拿房数','删房数']
        },
        grid: {
          x: 60,
          y: 50,
          x2: 40,
          y2: 50,
          borderWidth: 0,
        },
        axis: {
          show: false,
        },
        xAxis: [
          {
            type: 'category',
            splitLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                color: '#ddd',
                width: 1,
                type: 'solid'
              }
            },
            data: Object.keys(objectMerge(data.room_count))
          }
        ],
        yAxis: [
          {
            type: 'value',
            splitLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                color: '#ddd',
                width: 1,
                type: 'solid'
              }
            },
          }
        ],
        series: [
          {
            name: '拿房数',
            barGap: 3,
            barCategoryGap: 30,
            type: 'bar',
            data: Object.values(objectMerge(data.room_count))
          },
          {
            name: '删房数',
            barGap: 1,
            type: 'bar',
            data: Object.values(objectMerge(data.del_room_count))
          },
        ]
      };

      let option4 = {
        color: colorArray,
        tooltip : {
          trigger: 'item',
          formatter: function(params) {
            let name  = params[1],
                value = 0;
            if (name === '总客数') {
              value = data.total_customer;
            } else if (name === '已跟进') {
              value = data.total_customer - data.wait_follow_customer;
            } else {
              value = data.sign_customer;
            }
            return name + ': ' + value + '人';
          }
        },
        legend: {
          x: 'right',
          y: 'center',
          orient: 'vertical ',
          data : ['总客数','已跟进','已签约'],
          formatter: function(name) {
            let value = 0;
            if (name === '总客数') {
              value = data.total_customer;
            } else if (name === '已跟进') {
              value = data.total_customer - data.wait_follow_customer;
            } else {
              value = data.sign_customer;
            }
            return name + ': ' + value + '人';
          }
        },
        series : [
          {
            x: '-10%',
            x2: '40%',
            name:'漏斗图',
            type:'funnel',
            width: '90%',
            minSize: '25%',
            maxSize: '50%',
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: 'inside',
                  formatter: function(params) {
                    let value = 0;
                    if (params.name === '总客数') {
                      value = 100;
                    } else if (params.name === '已跟进') {
                      value = Math.round((data.total_customer - data.wait_follow_customer) / data.total_customer * 100) || 0;
                    } else {
                      value = Math.round(data.sign_customer / data.total_customer * 100) || 0;
                    }
                    return value + '%';

                  }
                }
              }
            },
            data:[
              {value: 60, name:'总客数'},
              {value: 40, name:'已跟进'},
              {value: 20, name:'已签约'},
            ]
          },
        ]
      };

      $('.chart-2').html('退租数量：' + data.unrent + '个<br />退租率: ' + data.unrent_rate + '<br />到期退租: ' + data.normal_unrent + '个<br />中途退租: ' + data.unnormal_unrent + '个');

      echarts.init(document.getElementById('chart-1')).setOption(option1);
      echarts.init(document.getElementById('chart-2')).setOption(option2);
      echarts.init(document.getElementById('chart-3')).setOption(option3);
      echarts.init(document.getElementById('chart-4')).setOption(option4);

    }
  },
});

import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Route.extend({
  afterModel(controller, model){
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

    function objectMerge(object) {
      let newObject = {};
      $.each(object, function(name, value) {
        $.extend(newObject, value);
      });
      return newObject;
    }

    // DOM 渲染完毕后立即执行
    Ember.run.later(function () {
      // 概况部分
      _this.get('auth').registerTokenToAjaxHeader();
      let url = _this.get("config").apiUrl1 + 'statistics/finances';
      ajax(url, {
        method: 'GET',
        async: false,
      }).then((res) => {
        render(res);
      }).catch((err) => {
        $.toastr.error("获取运营统计权限出错!请联系客服!");
      });

      function render(data) {
        if (!$('.chart-box-content').length) {
          return false;
        }

        let option5 = {
          color: colorArray,
          tooltip : {
            trigger: 'item',
            formatter: "{b}:{c}({d}%)"
          },
          legend: {
            orient : 'horizontal',
            x : 'center',
            data:['已收款','待收款']
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
                {value: data.receivable_fee, name: '已收款'},
                {value: data.unreceived_fee, name: '待收款'},
              ]
            }
          ]
        };

        let option6 = {
          color: colorArray,
          tooltip : {
            trigger: 'item',
            formatter: "{a}:{c}"
          },
          legend: {
            x: 'center',
            data:['应收','应付']
          },
          axis: {
            show: false,
          },
          grid: {
            x: 60,
            y: 50,
            x2: 40,
            y2: 50,
            borderWidth: 0,
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
              data: Object.keys(objectMerge(data.future_income))
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
              name: '应收',
              barWidth: 8,
              type: 'bar',
              data: Object.values(objectMerge(data.future_income))
            },
            {
              name: '应付',
              barWidth: 8,
              type: 'bar',
              data: Object.values(data.future_outlay)
            },
          ]
        };

        let option7 = {
          color: colorArray,
          tooltip : {
            trigger: 'item',
            formatter: "{a}: {c}"
          },
          grid: {
            x: 60,
            y: 50,
            x2: 40,
            y2: 50,
            borderWidth: 0,
          },
          legend: {
            x: 'center',
            data:['应收','应付']
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
              data: Object.keys(objectMerge(data.income))
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
              name: '应收',
              barWidth: 8,
              type: 'bar',
              data: Object.values(objectMerge(data.income))
            },
            {
              name: '应付',
              barWidth: 8,
              type: 'bar',
              data: Object.values(objectMerge(data.outlay))
            },
          ]
        };

        let option8 = {
          color: colorArray,
          tooltip : {
            trigger: 'item',
            formatter: "{b}:{c}({d}%)"
          },
          legend: {
            orient : 'horizontal',
            x : 'center',
            data:['租金','押金', '杂费']
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
                {value: data.rental_income, name: '租金'},
                {value: data.deposit_income, name: '押金'},
                {value: data.utilities_income, name: '杂费'},
              ]
            }
          ]
        };

        $('.chart-5').html('应收款：' + data.total_fee + '元<br />已收款: ' + data.receivable_fee + '元<br />待收款: ' + data.unreceived_fee + '元',);
        $('.chart-8').html('总收入：' + data.total_income + '元<br />租金: ' + data.rental_income + '元<br />押金: ' + data.deposit_income + '元<br />杂费: ' + data.utilities_income + '元',);

        echarts.init(document.getElementById('chart-5')).setOption(option5);
        echarts.init(document.getElementById('chart-6')).setOption(option6);
        echarts.init(document.getElementById('chart-7')).setOption(option7);
        echarts.init(document.getElementById('chart-8')).setOption(option8);
      }

    }.bind(this), 0);
  }
});

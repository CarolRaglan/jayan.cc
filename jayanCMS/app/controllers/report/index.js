import Ember from 'ember';

export default Ember.Controller.extend({
  month:"10",
  types: "run",
  hidden:2,
  tips:"filter",
  queryParams: ['type','flow_type','report_type', 'start_date', 'end_date', 'pay_method', 'rent_extras','fee_type','trader_type','income_type', 'pay_type','deposit_type','page', 'perPage',"hidden"],
  page: 1,
  perPage: 12,
 detail_flag:false,
  actions: {
    tabs(type){
      this.get("router").transitionTo({
        queryParams: {
          type: type,
          page: 1,
        }
      });

    },
    fees(type, e){
      this.get("router").transitionTo({
        queryParams: {
          report_type: type,
          page: 1,
        }
      });
      let dom = $(e.target);
      dom.addClass("active").siblings().removeClass("active");
    },
    screen(e){
      let types=$(e.target).attr("types");
      let tips=$(e.target).attr("tips");
      switch (types){

        case "run":{

          let start_date=$("#start_date").val();
          let end_date=$("#end_date").val();
          this.get("router").transitionTo({queryParams: {
            type:3,
            start_date:start_date,
            end_date:end_date,
            page:1
          }});

          if(tips==0){

            let pay_method=$("#s_flow_type").attr("data-value");/*全部支付方式*/
            let income_type=$("#s_income_type").attr("data-value");/*全部收入类型*/
            let rent_extras=$("#s_fees_type").attr("data-value");/*全部费用名称*/
            let fee_type=$("#s_fees_name").attr("data-value");/*全部费用类型*/
            this.get("router").transitionTo({queryParams: {
              start_date:start_date,
              end_date:end_date,
              pay_method:pay_method,
              income_type:income_type,
              fee_type:fee_type,
              rent_extras:rent_extras,
              page:1
            }});

          }
          if(tips==1){
            let pay_method=$("#s_flow_type").attr("data-value");/*全部支付方式*/
            let pay_type=$("#s_pay_type").attr("data-value");/*全部支出类型*/
            let rent_extras=$("#s_fees_type").attr("data-value");/*全部费用名称*/
            let fee_type=$("#s_fees_name").attr("data-value");/*全部费用类型*/
            this.get("router").transitionTo({queryParams: {
              start_date:start_date,
              end_date:end_date,
              pay_method:pay_method,
              pay_type:pay_type,
              fee_type:fee_type,
              rent_extras:rent_extras,
              page:1
            }});

          }
          if(tips==2){
            let trader_type=$("#s_people_type").attr("data-value");/*全部人员类型*/
            let pay_method=$("#s_flow_type").attr("data-value");/*全部支付方式*/
            let flow_type=$("#s_money_type").attr("data-value");/*全部资金流向*/
            let deposit_type=$("#s_deposit_type").attr("data-value");/*全部支出类型*/
            this.get("router").transitionTo({queryParams: {
              start_date:start_date,
              end_date:end_date,
              trader_type:trader_type,
              pay_method:pay_method,
              flow_type:flow_type,
              deposit_type:deposit_type,
              page:1
            }});

          }

          return;
        };

        case "month-report":{

          let date=$("#select_year").attr("data-value")+"-"+$("#select_month").attr("data-value");/*选择时间*/
          this.get("router").transitionTo({queryParams: {
            date:date,
            page:1
          }});

          return;
        };

        case "bill":{

          let start_date=$("#start_date").val();/*合同开始开始时间*/
          let end_date=$("#end_date").val();/*合同开始截止时间*/
          let contract_start_date=$("#end_start_date").val();/*合同到期开始时间*/
          let contract_end_date=$("#end_end_date").val();/*合同到期截止时间*/
          let status=$("#s_flow_type").attr("data-value");/*合同状态*/
          this.get("router").transitionTo({queryParams: {
            start_date:start_date,
            end_date:end_date,
            contract_start_date:contract_start_date,
            contract_end_date:contract_end_date,
            status:status,
            page:1
          }});

          return;

        };

        case "house-report":{

          let start_date=$("#trade_at__gte").val();/*房源录入时间*/
          let end_date=$("#e_end_date").val();/*房源录入截止时间*/
          let rent_status=$("#q_flow_type").attr("data-value");/*全部房源状态*/
          this.get("router").transitionTo({queryParams: {
            start_date:start_date,
            end_date:end_date,
            rent_status:rent_status,
            page:1
          }});

          return;

        };

      };
    },
    selectType(flag){
      this.set("feeType",flag);
    },
    switchMenu(line,style){
      this.set("tabpay",true);
      if (line === "report") {
        this.get("router").transitionTo(line, {
          queryParams: {
            type: 3
          }
        });
      } else {
        this.get("router").transitionTo(line);
      }
    },
    switchReportTab(type,e){
      this.set("tabPay",true);
      let dom=$(e.target);
      dom.css("color","#59acff").parent().siblings().find("a").css("color","#888c91");
      this.get("router").transitionTo('report',{
        queryParams: {
          type: type,
          page: 1,
        }
      });
      switch(type){
        case 0:
          $('#tab-income-trigger').trigger("click");
          break;
        case 1:
          $('#tab-pay-trigger').trigger("click");
          break;
        case 2:
          $('#tab-include-trigger').trigger("click");
          break;
      }
    },

    goToFinance(startDate,endDate,feeType,feeName,target){
      if(startDate.length>10) {
        startDate = startDate.split("-")[0];
        endDate = endDate.split("-")[1]
      }
      this.get("router").transitionTo("finance",{
        queryParams: {
          trade_at__gte:moment(startDate).format("YYYY-MM-DD"),/*开始时间*/
          trade_at__lte:moment(endDate).add('days', 1).format("YYYY-MM-DD"),/*结束时间*/
          fee_type_rough:feeType,/*费用类型*/
          fee_type:feeName,/*费用名称*/
          houseText:target,
          page: 1,
        }
      });
      $("#center li").removeClass("active").find("a").removeClass("active");
      $("#finance-index").addClass("active");
    }
  }

});

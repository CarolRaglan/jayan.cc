import Ember from 'ember';

export default Ember.Component.extend({

  actions:{
    tabs(type){
      this.get("router").transitionTo({
        queryParams: {
          type: type,
          page: 1,
        }
      });

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
            $("#s_flow_type").val("");/*全部支付方式*/
            $("#s_income_type").val("");/*全部收入类型*/
            $("#s_fees_type").val("");/*全部费用名称*/
            $("#s_fees_name").val("");/*全部费用类型*/


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
            $("#s_flow_type").val("");/*全部支付方式*/
            $("#s_pay_type").val("");/*全部支出类型*/
            $("#s_fees_type").val("");/*全部费用名称*/
            $("#s_fees_name").val("");/*全部费用类型*/


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
            $("#s_people_type").val("");/*全部人员类型*/
            $("#s_flow_type").val("");/*全部支付方式*/
            $("#s_money_type").val("");/*全部资金流向*/
            $("#s_deposit_type").val("");/*全部支出类型*/

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
    resetSty(hidden,line,e){
      let dom=$(e.target);
      dom.parent("li").addClass("addNew").find("a").css("color","#303e51").find("span").addClass("active");
      dom.parent("li").siblings().removeClass("addNew").find("a").css("color","#888c91").find("span").removeClass("active");
      $("#"+hidden).show().siblings("ul").hide();
      if(line=="report") {
        this.get("router").transitionTo('report', {
          queryParams: {
            type: 1,
            page: 1,
          }
        });
      }else if( line=="report.bill"){
        this.get("router").transitionTo(line,{
          queryParams: {
            type: ""
          }
        });
      }else{
        this.get("router").transitionTo(line)
      }
    },
    switchMenu(line){
      $(".condition-reset-btn").trigger("click");

      if (line === "report") {
        this.get("router").transitionTo(line, {
          queryParams: {
            type: 3
          }
        });
      } else if(line=='day-report') {
        this.get("router").transitionTo(line,{
          queryPrams:{

          }
        });
      }else if(line=='month-report') {
        this.get("router").transitionTo(line);
      }else{
        this.get("router").transitionTo(line);
      }
    },
    switchListTab(type){
      $(".condition-reset-btn").trigger("click");

      this.get("router").transitionTo('report.bill',{
        queryParams: {
          condition: type,
          page:1,
        }
      });
      $("#start_date").val("");
      $("#end_date").val("");
      $("#end_start_date").val("");
      $("#end_end_date").val("");
      $("#s_flow_type").val("");

      switch(type){

        case 1:

          $("#owner-list").trigger("click");
          break;
        case 0:


          $("#renter-list").trigger("click");
          break;
      }
    },
    switchReportTab(type,e){
      let dom=$(e.target);
      dom.css("color","#59acff").parent().siblings().find("a").css("color","#888c91");
      this.get("router").transitionTo('report',{
        queryParams: {
          type: type,
          page: 1,
        }

      });
      $("#s_people_type").val("");/*全部人员类型*/
      $("#s_flow_type").val("");/*全部支付方式*/
      $("#s_money_type").val("");/*全部资金流向*/
      $("#s_deposit_type").val("");/*全部支出类型*/
      $("#s_pay_type").val("");/*全部支出类型*/
      $("#s_fees_type").val("");/*全部费用名称*/
      $("#s_fees_name").val("");/*全部费用类型*/
      $("#s_income_type").val("");/*全部收入类型*/
      $("#start_date").val("");
      $("#end_date").val("");
      $(".condition-reset-btn").trigger("click");

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
    }
  }




});

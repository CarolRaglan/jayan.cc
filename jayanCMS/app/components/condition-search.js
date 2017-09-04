import Ember from 'ember';

export default Ember.Component.extend({

  actions:{
    reset(){

      this.get("router").transitionTo({queryParams: {
        start_date:"",
        end_date:"",
        pay_method:"",
        pay_type:"",
        fee_type:"",
        rent_extras:"",
        income_type:"",
        rent_status:"",
        trader_type:"",
        flow_type:"",
        deposit_type:"",
        contract_start_date:"",
        contract_end_date:"",
        status:status,
        page:1
      }});

      $("#s_people_type").val("").attr('data-value','');/*全部人员类型*/
      $("#s_flow_type").val("").attr('data-value','');/*全部支付方式*/
      $("#s_money_type").val("").attr('data-value','');/*全部资金流向*/
      $("#s_deposit_type").val("").attr('data-value','');/*全部支出类型*/
      $("#s_pay_type").val("").attr('data-value','');/*全部支出类型*/
      $("#s_fees_type").val("").attr('data-value','');/*全部费用名称*/
      $("#s_fees_name").val("").attr('data-value','');/*全部费用类型*/
      $("#s_income_type").val("").attr('data-value','');/*全部收入类型*/
      $("#trade_at__gte").val("").attr('data-value','');
      $("#q_flow_type").val("").attr('data-value','');
      $("#end_start_date").val("");
      $("#end_end_date").val("");
      $("#start_date").val("");
      $("#end_date").val("");

    },

    selectTime(){
      if(this.$('#start_date').val()!='' && this.$('#end_date').val()!=''){
        this.send('screen');
      }
    },

    screen(){
      let types = this.get('types'),tips = this.get('tips');
      let router = this.get('router');
      let type = '';
      let reg = /[?&]type=([^&#]*)/;
      if(reg.test(location.search)){
        reg = reg.exec(location.search)[1];
      }
      // let type = new URL(location.href).searchParams.get('type');
      switch (types){

        case "run":{

          let start_date=$("#start_date").val();
          let end_date=$("#end_date").val();
          this.get("router").transitionTo({queryParams: {
            type:type,
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
    // resetSty(e){
    //   let dom=$(e.target);
    //   dom.addClass("reSty").parent().siblings("li").children("a").removeClass("reSty");
    //   dom.children("i").eq(0).addClass("styHidden");
    //
    // },
    switchMenu(line){
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
      let dom=$(e.target);
      // dom.css("color","#59acff").parent().siblings().find("a").css("color","#888c91");
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
    }
  }


});

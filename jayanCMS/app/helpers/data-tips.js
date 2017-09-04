import Ember from 'ember';

export function dataTips(params/*, hash*/) {
  switch (params[0]){

    case "":{
      if(params[1]==="按租客账单到期时间"){
        return "按租客账单到期时间";
      }else{
        return "";
      }
    };
    case "r_empty":{
      return "待出租";
    };
    case "r_rented":{
      return "已出租";
    };
    case "r_decorating":{
      return "装修中";
    };
    case "ro_exceed":{
      return "租客逾期账单";
    };
    case "ho_exceed":{
      return "业主逾期账单";
      break;
    };
    case "ro_pay":{
      return "按租客账单到期时间";
    };
    case "ho_pay":{
      return "按业主账单到期时间";
      break;
    };
    case "rc_end":{
      return "按租客合同到期时间";
    };
    case "hc_end":{
      return "按业主合同到期时间";
    };
    case "h_created":{
      return "按房源创建时间";
    };
    case "advanced":{
      return "按账单开始时间提前收租";
    };
    case "fixed":{
      return "按固定时期收租";
    };
    case "male":{
      return "男";
    };
    case "female":{
      return "女";
    };
    case "other":{
      return "未知";
    };
    case "entrust":{
      return "官网委托";
    };
    case "reserve":{
      return "官网预约";
    };
    case "58":{
      return "58同城";
    };
    case "ganji":{
      return "赶集网";
    };
    case "id":{
      return "身份证";
    };
    case "passport":{
      return "护照";
    };
    case 0:{
      return "延后";
    };
    case 1:{
      if(params[1]=="urgency"){
        return "正常";
      }else{
        return "来电";
      }

    };
    case 2:{
      if(params[1]=="urgency"){
        return "紧急";
      }else{
        return "58同城";
      }

    };
    case 3:{
      return "赶集网";
    };
    case 4:{
      return "安居客";
    };
    case 5:{
      return "官网预约";
    };
    case 6:{
      return "微信";
    };
    case 7:{
      return "自来客";
    };
    case 8:{
      return "转介绍";
    };
    case 9:{
      return "中介";
    };
    case 10:{
      return "其他";
    };
    case 11:{
      return "房天下";
    };
    case 12:{
      return "豆瓣";
    };
    case 13:{
      return "百姓网";
    };
    case 14:{
      return "闲鱼";
    };
    case 15:{
      return "微博";
    };
    case 16:{
      return "官网在线";
    };
    case 17:{
      return "运营管理";
    };

  }
}

export default Ember.Helper.helper(dataTips);

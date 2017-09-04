import Ember from 'ember';

export function payMethod([month]/*, hash*/) {
  switch (month){
    case 1:{
      return "月付"
    };
    case 2:{
      return "2月付"
    };
    case 3:{
      return "季付"
    };
    case 4:{
      return "4月付"
    };
    case 5:{
      return "5月付"
    };
    case 6:{
      return "半年付"
    };
    case 7:{
      return "7月付"
    };
    case 8:{
      return "8月付"
    };
    case 9:{
      return "9月付"
    };
    case 10:{
      return "10月付"
    };
    case 11:{
      return "11月付"
    };
    case 12:{
      return "年付"
    };
    default:{
      return month+'月付'
    }
  }
}

export default Ember.Helper.helper(payMethod);

import Ember from 'ember';
import fees from '../data/fees';
import {clone} from '../utils/index';
let extra = clone(fees.extra);
let offTypeMap = {
  disabled_normal:'正常退租',
  disabled_unnormal:'提前退租'
};
export default Ember.Component.extend({
  tagName:'dl',
  classNames:'list-info',
  type:'customer',  //type默认是 customer ,它还可以是owner
  offType:Ember.computed('contract.status',function () {
    let status = this.get('contract.status');
    if(status){
      return offTypeMap[status] || null;
    }
  }),
  hasSmartPowerMeter:Ember.computed('type','smartDevices',function () {
    let type = this.get('type'), smartDevices = this.get('smartDevices')||[];
    return type === 'customer' && smartDevices.length > 0;
  }),
  collect:Ember.computed('contract',function () {
    let contract = this.get('contract');
    if(!contract){
      return;
    }
    if(contract.rent_pay_way==='fixed'){
      return {
        title:'固定交租日',
        time:'当月'+contract.fixed_pay_date+'号'
      };
    }else{
      return {
        title:'提前支付天数',
        time:contract.advanced_days+'天'
      };
    }
  }),
  extra:Ember.computed('contract',function(){
    let contract = this.get('contract');
    if(!contract){
      return;
    }
    let list = contract.meter_info||contract;
    return extra.reduce((pub,it)=>{
      let type = it.type, charge = type+'_charge';
      let obj = {};
      obj.name = it.name;
      obj.type = it.type;
      if(list[charge]){
        obj.calcType = list[charge];
        obj.payType = fees.typeHash[list[charge]];
        switch(list[charge]){
          case 'by_meter':
            obj.logTime = list[type+'_meter_time'];
            obj.logTick = list[type+'_meter'];
            obj.count = list[type+'_unit_price'];
            obj.unit = it.unit;
            pub.push(obj);
            break;
          case 'fixed':
            if(list[type+'_fees']){
              obj.count = list[type+'_fees']
              pub.push(obj);
            }
            break;
          case 'prepayment':
            pub.push(obj);
            break;
          default:
            break;
        }
      }else if(list[it.code]){
        obj.count = list[it.code];
        obj.calcType = 'fixed';
        obj.payType = fees.typeHash['fixed'];
        pub.push(obj);
      }
      return pub;
    },[]);
  }),
  actions:{
    switchType(...args){
      this.sendAction('switchType',...args);
    }
  }
});

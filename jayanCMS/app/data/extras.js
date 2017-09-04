import {clone} from '../utils/index';
let chargeType = [
  {
    name: '固定每月收费',
    code: 'fixed'
  }, {
    name: '抄表收费',
    code: 'by_meter'
  }, {
    name: '按预充值计算',
    code: 'prepayment'
  }
];

let unit = {
  water: '吨',
  gas: '立方米',
  power: '度'
};

let chargeHash = chargeType.reduce((buffer,it)=>{
  buffer[it.code] = it;
  return buffer;
},{});

let getChargeType = function ({withMeter,smart}) {
  let pub = [chargeHash.fixed];
  if(withMeter){
    pub.push(chargeHash.by_meter);
  }
  return clone(smart?[chargeHash.prepayment]:pub);
};


let getUnit = function ({type,byMeter}) {
  return `元/${byMeter?unit[type]:'月'}`;
};

export {chargeType,unit,getChargeType,getUnit}

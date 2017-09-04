import DS from 'ember-data';

export default DS.Model.extend({
  renew: DS.attr('string'),
  number: DS.attr('string'),
  startTime: DS.attr('string'),
  endTime: DS.attr('string'),
  monthRental: DS.attr('string'),
  pendingOrderId: DS.attr('number'),
  deposit: DS.attr('number',{defaultValue: 0}),
  advancedDays: DS.attr('number'),
  price: DS.attr('number'),
  freeDays: DS.attr('number', {defaultValue: 30}),
  location: DS.attr('string'),
  status: DS.attr('string'),
  actualEndTime: DS.attr('string'),//退租时间
  payMethodF: DS.attr('number', {defaultValue: 3}),
  payMethodY: DS.attr('number', {defaultValue: 1}),
  payMethod: DS.attr('string', {defaultValue: 'alipay'}),

  customerName: DS.attr('string'),
  customerPhone: DS.attr('string'),
  customerIdNumber: DS.attr('string'),
  segmentInfo: DS.attr('string'),
  normalDisable: DS.attr('boolean'),
  rooms: DS.attr('string'),
  customerIdPictures:DS.attr('string'),//身份证照片
  pictures:DS.attr('string'),//合同照片
  comment:DS.attr('string'),//备注
  waterCharge:DS.attr('string'),//水费计费方式
  waterUnitPrice:DS.attr('number'),//	水费单价
  waterMeterCurrent:DS.attr('string'),//	水费当前读表
  waterFees:DS.attr('string',{defaultValue: 0}),// 水费固定费用
  waterMeterTime:DS.attr('string'),// 水费抄表日期
  powerCharge:DS.attr('string'),//电费计费方式
  powerUnitPrice:DS.attr('number'),//	电费单价
  powerMeterCurrent:DS.attr('string'),//	电费当前读表
  powerFees:DS.attr('string',{defaultValue: 0}),// 电费固定费用
  powerMeterTime:DS.attr('string'),// 电费抄表日期
  gasFees: DS.attr('number', {defaultValue: 0}),
  propertyFees: DS.attr('number', {defaultValue: 0}),
  serviceFees: DS.attr('number', {defaultValue: 0}),
  upkeepFees: DS.attr('number', {defaultValue: 0}),
  cleaningFees: DS.attr('number', {defaultValue: 0}),
  materialFees: DS.attr('number', {defaultValue: 0}),
  catvFees: DS.attr('number', {defaultValue: 0}),
  internetFees: DS.attr('number', {defaultValue: 0}),
  sanitationFees: DS.attr('number', {defaultValue: 0}),
  otherFees: DS.attr('number', {defaultValue: 0}),
  freeFees: DS.attr('number', {defaultValue: 0}),
});

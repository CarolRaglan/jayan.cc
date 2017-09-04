import DS from 'ember-data';

export default DS.Model.extend({

  /*租客*/
  locationRoom: DS.attr('string'),/*租住房间*/
  customerName: DS.attr('string'),/*	租客姓名*/
  customerPhone: DS.attr('string'),/*租客联系方式*/
  /*业主*/
  ownerName: DS.attr('string'),/*业主姓名*/
  ownerPhone: DS.attr('string'),/*业主联系方式*/
  location: DS.attr('string'),/*房源*/
  /*公用*/
  createdTime:DS.attr('string'),
  status: DS.attr('string'),/*状态*/
  durationTime: DS.attr('string'),/*租约时长*/
  startTime: DS.attr('string'),/*开始时间*/
  endTime: DS.attr('string'),/*	到期时间*/
  payMethod: DS.attr('string'),/*支付方式*/
  rentAmount: DS.attr('number'),/*月租金*/
  depositAmount: DS.attr('number'),/*压金*/
  unrentTime:DS.attr("string"),/*退租时间*/
  unrentStatus:DS.attr("string"),/*退租类型*/
  inDays:DS.attr('string'),/*实际入住周期*/


});

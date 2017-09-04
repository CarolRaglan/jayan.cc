import DS from 'ember-data';

export default DS.Model.extend({

  createdAt: DS.attr('string'),/*创建时间*/
  operatedAt:DS.attr('string'),/*跟进时间*/
  source: DS.attr('number'), /*租客来源*/
  name: DS.attr('string'), /*租客姓名*/
  phone: DS.attr('number'), /*联系方式*/
  bookTime:DS.attr('string'),/*预约时间*/
  address: DS.attr('string'),/*预约区域/小区*/
  wantedDay: DS.attr('string'),/*入住时间*/
  minRent: DS.attr('number'),/*最低价格*/
  maxRent: DS.attr('number'),/*最高价格*/
  length: DS.attr('number'),/*租期*/
  headcount: DS.attr('string'),/*租住人数*/
  houseType: DS.attr('string'),/*户型*/
  urgency: DS.attr('number'),/*紧急状况*/
  operatorName: DS.attr('string'),/*跟进人*/
  status: DS.attr('number'), /*进度状态*/
  comments: DS.attr('string'),/*操作*/
});

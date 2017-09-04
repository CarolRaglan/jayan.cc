import DS from 'ember-data';

export default DS.Model.extend({
  /*营业报表*/
  createdAt: DS.attr('string'),/*日期*/
  reportDate: DS.attr('string'),/*日期*/
  houseNum: DS.attr('number'),/*房源*/
  roomNum: DS.attr('number'),/*房间*/
  ownerNum: DS.attr('number'),/*业主*/
  customerNum: DS.attr('number'),/*租客*/
  rentAmount: DS.attr('number'),/*租金*/
  rentDeposit: DS.attr('number'),/*押金*/
  waterFees: DS.attr('number'),/*水费*/
  powerFees: DS.attr('number'),/*电费*/
  gasFees: DS.attr('number'),/*燃气费*/
  propertyFees: DS.attr('number'),/*物业费*/
  serviceFees: DS.attr('number'),/*服务费*/
  upkeepFees: DS.attr('number'),/*维修费*/
  cleaningFees: DS.attr('number'),/*保洁费*/
  materialFees: DS.attr('number'),/*材料费*/
  catvFees: DS.attr('number'),/*有线电视费*/
  internetFees: DS.attr('number'),/*宽带费*/
  sanitationFees: DS.attr('number'),/*卫生费*/
  decorationFees: DS.attr('number'),/*装修费*/
  otherFees: DS.attr('number'),/*其他费*/

  addOwnerNum: DS.attr('number'),/*新增业主*/
  addCustomerNum: DS.attr('number'),/*新增租客*/
  renewOwnerNum: DS.attr('number'),/*续租业主*/
  renewCustomerNum: DS.attr('number'),/*续租租客*/
  unrentOwnerNum: DS.attr('number'),/*退租业主*/
  unrentCustomerNum: DS.attr('number'),/*退租租客*/
  income: DS.attr('number'),/*总收入*/
  outcome: DS.attr('number'),/*总支出*/
  totalFees: DS.attr('number'),/*净收入*/
});

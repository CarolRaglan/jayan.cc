import DS from 'ember-data';

export default DS.Model.extend({
  /*支出明细,收入明细,押金明细*/
  tradeAt: DS.attr('string'),/*日期*/
  traderName: DS.attr('string'),/*付款人、收款人*/
  traderType: DS.attr('string'),/*人员类型*/
  tradeInfo: DS.attr('string'),/*房源信息*/
  payMethod: DS.attr('string'),/*支付方式*/
  sourceFrom: DS.attr('string'),/*支出类型*/
  feeType: DS.attr('string'),/*费用类型*/
  feeName: DS.attr('string'),/*费用名称*/
  durationTime: DS.attr('string'),/*账单周期*/
  realAmount: DS.attr('number'),/*费用金额*/
  remark: DS.attr('string'),/*备注*/
  /*押金明细*/
  moneyFlow: DS.attr('string'),/*资金流向*/
});

import DS from 'ember-data';

export default DS.Model.extend({
  proportion:DS.attr("string"),//百分比
  tradeId:DS.attr("string"), // 交易流水号
  tradeType:DS.attr("string"),// 交易类型
  tradeStatus:DS.attr("string"), // 交易状态
  feeType:DS.attr("string"),  // 费用类型
  amount:DS.attr("string"),// 交易金额
  tradeAt:DS.attr("string"),// 交易时间
  houseInfo:DS.attr("string"), // 房源信息
  customerName:DS.attr("string"),// 租客姓名
  payWay:DS.attr("string"),// 支付方式
  customerPhone:DS.attr("string"),// 租客手机号
  orderCycle:DS.attr("string"),// 账单周期


});

import DS from 'ember-data';

export default DS.Model.extend({
  customerName:DS.attr("string"),//租客姓名
  customerPhone:DS.attr("string"), // 租客电话
  createdAt:DS.attr("string"),// 申请贷款时间
  confirmAt:DS.attr("string"), // 确认贷款时间
  loan:DS.attr("number"),  // 贷款金额
  installmentNum:DS.attr("number"),// 分期数
  monthRental:DS.attr("number"),// 月租金
  payStatus:DS.attr("string"), // 还款状态
  contractStatus:DS.attr("string"),// 合同状态
  debtAmount:DS.attr("number"),// 待还款金额

});

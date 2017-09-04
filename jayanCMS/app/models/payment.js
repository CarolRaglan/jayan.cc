import DS from 'ember-data';

export default DS.Model.extend({
  transactionId: DS.attr("string"),
  tradeObject: DS.attr("string"),
  tradeAt:DS.attr("string"),
  tradeInfo:DS.attr("string"),
  traderName:DS.attr("string"),
  feeType:DS.attr("string"),
  flowType:DS.attr("string"),
  realAmount:DS.attr("string"),
  feeTypeRough:DS.attr("string"),
  startTime:DS.attr("string"),
  endTime:DS.attr("string"),
  payMethod:DS.attr("string"),
  amount:DS.attr("string"),
});

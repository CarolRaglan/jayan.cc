import DS from 'ember-data';

export default DS.Model.extend({
  role:DS.attr("string"),
  name:DS.attr("string"),
  account_type:DS.attr("string"),
  phone:DS.attr("string"),
  createdAt:DS.attr("string"),
  remark:DS.attr("string"),
  areas:DS.attr("number"),
  houses:DS.attr("number"),
  houseIds:DS.attr("number"),
  isAll:DS.attr("boolean")

});

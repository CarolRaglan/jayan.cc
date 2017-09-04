import DS from 'ember-data';

export default DS.Model.extend({
  target:DS.attr("string"),
  readn:DS.attr("string"),
  content:DS.attr("string"),
  createdAt:DS.attr("string"),
});

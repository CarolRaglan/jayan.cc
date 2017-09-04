import DS from 'ember-data';

export default DS.Model.extend({
  area:DS.attr('string'),//小区
  houses:DS.attr(),//房源
});

import DS from 'ember-data';

export default DS.Model.extend({

  createdAt: DS.attr('string'),
  rentStatus: DS.attr('string'),
  city: DS.attr('string'),
  district: DS.attr('string'),
  block: DS.attr('string'),
  area: DS.attr('string'),
  location: DS.attr('string'),
  isWhole: DS.attr('string'),
  roomNum: DS.attr('number'),

});

import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  houses: DS.hasMany('houses', {async: true})
});


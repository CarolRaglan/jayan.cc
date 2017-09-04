import DS from 'ember-data';

export default DS.Model.extend({

  city: DS.attr('string'),
  district: DS.attr('string'),
  block: DS.attr('string'),
  address: DS.attr('string'),
  area: DS.attr('string'),
  buildingNum: DS.attr('string'),
  unitNum: DS.attr('string'),
  floorNum: DS.attr('string'),
  houseNum: DS.attr('string'),
  isDecorating: DS.attr('boolean', {defaultValue: false}),
  decoratingStartAt: DS.attr('string'),
  decoratingEndAt: DS.attr('string'),

  rentStatus: DS.attr('string', {defaultValue: "empty"}),
  //当前户型
  livingrooms: DS.attr('number'),
  washrooms: DS.attr('number'),
  bedrooms: DS.attr('number'),
  //原始户型
  oldBedrooms: DS.attr('number'),
  oldLivingrooms: DS.attr('number'),
  oldWashrooms: DS.attr('number'),
  space: DS.attr('number'),
  price: DS.attr('number'),
  name: DS.attr('string'),
  location: DS.attr('string'),

  rentedRooms: DS.attr('number'),
  totalRooms: DS.attr('number'),
  employers: DS.attr('string'),
  employerIds: DS.attr('string'),
  // isWhole: DS.attr('boolean', {defaultValue: false}),

  rooms: DS.hasMany('room', {async: true}),
  housecontract: DS.belongsTo('housecontract', {async: true})

});

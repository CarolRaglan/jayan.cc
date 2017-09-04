import DS from 'ember-data';

export default DS.Model.extend({

  area: DS.attr('string'),
  houseName: DS.attr('string'),
  roomName: DS.attr('string'),
  status: DS.attr('number'),
  rentStatus: DS.attr('string'),
  isWhole: DS.attr('boolean'),
  customerName: DS.attr('string'),
  updateTime: DS.attr('string'),
  errMsg: DS.attr('string'),
  channel_status:DS.attr()
});

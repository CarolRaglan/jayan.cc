import DS from 'ember-data';

export default DS.Model.extend({

  name       : DS.attr('string'),//名称
  price      : DS.attr('number'),//价格
  space      : DS.attr('number'),//面积
  rentStatus : DS.attr('string'),//租住状态
  status     : DS.attr('string'),//租住状态
  lockEndTime: DS.attr('date'),
  identifier : DS.attr('string'),
  edited     : DS.attr('boolean'),
  pendingOrderId:DS.attr('number'),
  customerName : DS.attr('string'),//当前租客名字
  customerPhone : DS.attr('string'),//当前租客电话
  startTime : DS.attr('string'),//当前合同开始时间
  endTime : DS.attr('string'),//当前合同结束时间
  currentSegmentInfo: DS.attr('string'),
  washingMachines:DS.attr('boolean'),//洗衣机
  airConditionings:DS.attr('boolean'),//空调
  televisions:DS.attr('boolean'),//电视机
  fridge :DS.attr('boolean'),//冰箱
  internet:DS.attr('boolean'),//宽带
  balconies:DS.attr('boolean'),//阳台
  windows:DS.attr('boolean'),//飘窗
  kitchens:DS.attr('boolean'),//厨房
  washrooms:DS.attr('boolean'),//卫生间
  waterHeaters:DS.attr('boolean'),//热水器
  payMethodF: DS.attr('number', {defaultValue: 3}),//付
  payMethodY: DS.attr('number', {defaultValue: 1}),//押
  toward:DS.attr('string',{defaultValue:"unknown"}),//朝向
  pictures:DS.attr('string'),//图片路径
  createContract(ids=this.id){
    return this.store.createRecord('roomcontract', {
      rooms: ids
    })
  }

});

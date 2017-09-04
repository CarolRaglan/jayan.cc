import Ember from 'ember';
import {getUnit, getChargeType} from '../data/extras';
import {clone} from '../utils/index';

export default Ember.Component.extend({
  chargeByMeter: false,
  smartDevice:false,
  type: Ember.computed.alias('fee.id'),  //杂费类型 eg. water
  chargeType: Ember.computed('fee', function () {
    let {meter_reading: withMeter,smart} = this.get('fee');
    smart && this.set('smartDevice',smart);
    return getChargeType({withMeter, smart});
  }),
  unitTitle: Ember.computed('chargeByMeter', function () {
    let byMeter = this.get('chargeByMeter');
    return byMeter ? '单价' : '费用金额';
  }),
  unit: Ember.computed('chargeByMeter', function () {
    let byMeter = this.get('chargeByMeter');
    let type = this.get('type');
    return getUnit({type, byMeter});
  }),

  actions: {
    select(it){
      this.set('chargeByMeter', it.code === 'by_meter');
    }
  }

});

import Ember from 'ember';
import ajax from 'ic-ajax';
import fees from '../data/fees';
import {clone} from '../utils/index';
import $ from 'jquery';
import moment from 'moment';

let predefine = [{
  name: '租金',
  code: 'amount'    //pay attention: 这里是amount而不是month_rental
}, {
  name: '押金',
  code: 'deposit'
}, {
  name: '原房屋押金',
  code: 'old_deposit',
  checked: true,
  disabled: true
}];

let emptyBill = {
  start_time: '',
  end_time: '',
  ought_pay_time: '',
  v: {
    period: {
      on: false,
      tips: "请完善账单周期",
    },
    payTime: {
      on: false,
      tips: "请选择应收租日期"
    },
    extras: {
      on: false,
      tips: "请选择至少一项费用"
    }
  }
};

export default Ember.Component.extend({
  dateFormat: "YYYY-MM-DD",

  typeObserver: Ember.observer('refresh', function () {
    let order = this.get('order');
    if (!order) {
      return;
    }
    let extras = clone(predefine.concat(fees.extra));
    if (order['old_deposit']) {
      order['old_deposit'] = -order['old_deposit'];
    } else {
      extras.splice(2, 1);
    }
    extras = extras.map(it => {
      let fee;
      if (it.type && order[`${it.type}_charge`] === 'by_meter') {
        it.disabled = true;
        it.value = 0;
      }
      if (fee = order[it.code]) {
        it.checked = true;
        it.value = Math.abs(fee);
        it.negative = fee < 0;
      }
      return it;
    });
    order = $.extend({extras}, clone(emptyBill), order);
    this.set('bill', order);
  }),

  actions: {

    reverseFee(fee, e){
      let type = $(e.target).val();
      let negative = type === '支出';
      if (fee.negative !== negative) {
        Ember.set(fee, 'negative', negative);
      }
      this.send('clearFeeTips');
    },

    changeFee(fee){
      if (fee.value < 0) {
        Ember.set(fee, 'negative', !fee.negative);
        Ember.set(fee, 'value', Math.abs(fee.value));
      }
      this.send('clearFeeTips');
    },

    updateTime(key, date){
      let format = this.get('dateFormat');
      let bill = this.get('bill');
      let map = {
        start_time: 'period',
        end_time: 'period',
        ought_pay_time: 'payTime'
      };
      if (date) {
        Ember.set(bill, key, moment(date).format(format));
      }
      Ember.set(bill.v[map[key]], 'on', false);
    },

    clearFeeTips(){
      let it = this.get('bill.v.extras');
      if (it && it.on) {
        Ember.set(it, 'on', false);
      }
    },

    update(bill){
      let type = bill.owner_name ? 'house' : 'room';
      let actionTypeName = bill.id ? '更新' : '新增';
      let format = this.get('dateFormat');
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl + `${type}orders`;
      if (bill.id) {
        url += '/' + bill.id;
      }
      let {comments, contract_id, start_time, end_time, ought_pay_time} = bill;
      // verify
      let valid = true;
      if (!(bill.start_time && bill.end_time)) {
        Ember.set(bill.v.period, 'on', true);
        valid = false;
      }
      if (!bill.ought_pay_time) {
        Ember.set(bill.v.payTime, 'on', true);
        valid = false;
      }
      let total = 0;
      bill.extras.forEach(it => {
        if (it.checked && it.value) {
          total += it.value;
        }
      });
      if (total === 0) {
        Ember.set(bill.v.extras, 'on', true);
        valid = false;
      }
      if (!valid) {
        return;
      }
      let extras = bill.extras.reduce((pub, fee) => {
        if(fee.checked){
          pub[fee.code] = (fee.negative ? -fee.value : fee.value) || 0;
        }else{
          pub[fee.code] = 0;
        }
        return pub;
      }, {});
      let param = $.extend({contract_id, start_time, end_time, ought_pay_time, comments}, extras);
      if (!bill.id) {
        param.contract_id = bill.contract_id;
      }
      if(param['old_deposit']){
        param['old_deposit'] = Math.abs(param['old_deposit']);
      }
      'start_time,end_time,ought_pay_time'.split(',').forEach(key=>{
        param[key] = moment(param[key],format).format(format);
      });
      ajax(url, {method: bill.id ? 'patch' : 'post', data: param}).then(res => {  //通过有无id来判断是编辑还是新增
        $.toastr.success(`账单${actionTypeName}成功.`);
        this.$('.xsd-modal-close').eq(0).click();
        $('#roomBack').click();
        this.sendAction("updateStatus", bill[`${type}_id`], type, res.id);
      }).catch(err => $.toastr.error(`账单${actionTypeName}失败！`));
    }

  }

});

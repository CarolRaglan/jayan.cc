import Ember from 'ember';
import ajax from 'ic-ajax';
import validate from '../utils/validate';
import fees from '../data/fees';
import {clone,getMathPeriod} from '../utils/index';

let offType = [{
  name:'到期退租',
  value:0,
  active:true
},{
  name:'中途退租',
  value:1,
  advanced:true
}];

/**
 * 计算总费用
 * @param contract {Object} <required> 合同对象
 * @return {Number} 总费用
 */
let calcAmount = function(contract){
  let amount = 0;
  amount -= contract.deposit||0;
  if(contract.installment_info){
    amount -= contract.installment_info.need_refund_amount || 0;
  }
  return amount;
};

export default Ember.Component.extend({
  dateFormat:"YYYY-MM-DD",
  extra:clone(fees.extra),
  offType:clone(offType),
  advanced:false, //标志量，标志是否是提前退租
  period:null,  //eg. 提前25天

  data: null,

  amount: null,

  typeObserver:Ember.observer('refresh',function(){
    let contract = this.get('contract');
    if(contract){
      this.set('amount',calcAmount(contract));
    }
  }),

  actions: {

    //关闭当前窗口，执行缓存数据的清理操作
    onCloseModal(){
      let contract = this.get('contract');
      this.set('offType',clone(offType));
      this.set('advanced',false);
      this.set('extra',clone(fees.extra));
      this.$('[name=reason]').val('');
      this.$('[name=c_rentamount]').val(contract.month_rental);
      this.$('[name=c_deposit]').val(contract.deposit);
      this.set('amount',calcAmount((contract)));
      return false;
    },

    //切换退租类型
    toggleOffType(checked,e){
      this.get('offType').forEach(it=>Ember.set(it,'active',it.name===checked.name));
      this.set('advanced',checked.advanced);
    },

    //切换杂费是否选中
    toggleFee(fee){
      Ember.set(fee,'checked',!fee.checked);
      Ember.run.next(()=>{
        this.send('count');
      });
    },

    // 计算退租时间间隔的文本表示
    calcTime(e){
      let format = this.get('dateFormat');
      let contract = this.get('contract');
      let actually = $(e.target).val();
      let guess = contract.end_time;
      if(guess===actually){
        this.set('period',null);
      }else{
        let period = getMathPeriod(actually,guess,format);
        let text = period.negative?'延后':'提前';
        text += period.month?`${period.month}月`:'';
        text += period.day?`${period.day}天`:'';
        this.set('period', text);
      }
    },

    count(){
      let amount = this.$('.list-fee > li').map((i,li)=>{
        let labels = $('>label',li),
          type = labels.eq(0).find('input').val(),
          value = labels.eq(1).find('input').val(),
          fee = 0;
        if(value==''){
          value = 0;
          labels.eq(1).find('input').val(0);
        }
        switch(type){
          case '应退':
          case '退部分':
            fee = -value;
            break;
          case '全退':
            fee = - this.get('contract').deposit;
            labels.eq(1).find('input').val(-fee);
            break;
          case '应收':
            fee = value;
            break;
          case '不退':
            labels.eq(1).find('input').val('0');
            fee = 0;
            break;
          default:
            fee = 0;
            break;
        }

        fee = parseFloat(fee);
        if(isNaN(fee)){
          labels.eq(1).find('input').val('0');
          fee = 0;
        }
        return fee;
      }).toArray().reduce((a,b)=>a+b);
      this.set('amount',amount);
    },

    update(id){

      let contract = this.get('contract');
      let type = contract.owner_name ? 'house' : 'room';

      let config = this.get('config');
      let url = null;
      let status_id = null;
      if(type==='house'){
        url = config.apiUrl + 'houseevictionorders';
        status_id = contract.house;
      }else{
        url = config.apiUrl + 'roomevictionorders';
        status_id = contract.room;
      }

      let param = {};
      param.contract =  id;
      fees.extra.map(it=>{
        let input = this.$(`[name=${it.code}]`);
        let fee = input.val()||0;
        let type = input.parent().prev().find('input').val();
        if(type==='应退'){
          fee = -fee;
        }
        param[it.code] = fee;
      });

      let offType = this.get('offType');  //退租类型
      param.eviction_type = offType.find(it=>it.active).value;
      param.end_time = this.$('[name=end_time]').val();

      let $rental = this.$('[name=rental]');
      let rentalType = $rental.parent().prev().find('input').val();
      if(rentalType=='应收'){
        param.rentamount_return = 0;
        param.rentamount_append = $rental.val();
      }else{  //应退
        param.rentamount_return = $rental.val();
        param.rentamount_append = 0;
      }
      let $deposit = this.$('[name=deposit]');
      param.deposit_type = $deposit.parent().prev().find('input').attr('data-value');
      param.deposit = $deposit.val();

      param.eviction_reason = this.$('[name=reason]').val();

      this.get('auth').registerTokenToAjaxHeader();
      ajax(url, {
        method: 'post',
        data: param,
      }).then((res) => {
        $.toastr.success("退租成功!");
        $("#cancelContract .xsd-modal-close").eq(0).click();
        $("#handleHouseContract .xsd-modal-close").eq(0).click();
        $("#handleRoomContract .xsd-modal-close").eq(0).click();
        this.sendAction("updateStatus", status_id, type);
      }).catch((err)=> {
        $.toastr.error(validate(err));
      });
    }

  }

});

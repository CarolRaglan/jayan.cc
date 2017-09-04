import Ember from 'ember';
import fees from '../data/fees';

export default Ember.Component.extend({
  classNames:'panel-tiny',
  inPayment:Ember.computed('bill.pay_status',function () {
    return this.get('bill.pay_status') === 5;
  }),
  extras:Ember.computed('bill',function () {
    let bill = this.get('bill');
    return bill?fees.extra.reduce((pub,it)=>{
      // charge 计费类型 ,by_meter 或者 fixed;
      // unready 表示该项费用还没有产生，还没准备好 ;
      // value 费用值 ;
      // log (抄表)记录时间 ;
      // unpaid 该项费用还未收的部分
      let type = it.type ,charge = type + '_charge' ,fee = {};
      fee.name = it.name;
      if(bill['pay_status']===5 && bill['unpaid_fees'][it.code]){
        fee.unpaid = bill['unpaid_fees'][it.code];
      }
      if(bill[charge]==='by_meter'){
        fee.charge = bill[charge];
        if(bill['has_read_meter']){
          fee.log = bill[type+'_meter_time'];
          fee.paid = bill[it.code];
          fee.unready = false;
        }else{
          fee.unready = true;
        }
        pub.push(fee);
      }else if(bill[it.code]){
        fee.paid = bill[it.code];
        pub.push(fee);
      }
      return pub;
    },[]):[];
  })
});

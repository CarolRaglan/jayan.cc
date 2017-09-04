import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Component.extend({

  m:Ember.computed.alias('order.attributes'),
  meter:Ember.computed('m',function(){
    let m = this.get('m')||{};
    return 'water,power,gas'.split(',').reduce((buffer,type)=>{
      buffer[type] = m[type+'_charge'] === 'by_meter';
      return buffer;
    },{});
  }),


  actions: {

    watcher(type,prev,e){
      let target = $(e.target);
      let meterName = {
            water:'水表',
            gas:'燃气表',
            power:'电表'
          };
      let value = parseFloat(target.val());
      if(isNaN(value)){
        target.val(prev.toFixed(2));
        $.toastr.error(`${meterName[type]}读数只能输入数字`);
      }
      if(value<prev){
        target.val(prev.toFixed(2));
        $.toastr.error(`${meterName[type]}本次读数不能小于上次${meterName[type]}读数`);
      }
      let unitPrice = parseFloat( this.$(`[name=${type}_unit_price]`).val() );
      let amount = (value-prev) * unitPrice;
      this.$(`[name=${type}_fees]`).val(amount.toFixed(2));
    },

    refreshMeter(){

      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get('config').apiUrl1+"smart/power/read_ammeter_data?room_id="+ this.get("order").attributes.room_id;
      ajax(url, {
        method: 'get',
      }).then((res) => {
        this.set("m.smart_value.num",res.data.node);
        $.toastr.success("刷新读表成功！");
      }).catch((xhr, err) => {
        $.toastr.error("读表失败");
      });
    },

    readMeter(id,roomId){

      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get('config').apiUrl;
      let param = {};
      'water,gas,power'.split(',').forEach(type=>{
        let fees = type+'_fees', logTime = type+'_meter_time' , tick = type+'_meter';
        param[fees] = this.$(`[name=${fees}]`).val();
        param[tick] = this.$(`[name=${tick}]`).val();
        param[logTime] = this.$(`[name=${logTime}]`).val();
      });
      ajax(url + 'meterroomorders/' + id, {
        method: 'patch',
        data: param
      }).then((res) => {
        $.toastr.success("抄表成功！");
        this.$(".xsd-modal-close").eq(0).click();
        this.sendAction("updateStatus",roomId,"room");
        $("#roomBack").trigger("click");
      }).catch((xhr, err) => {
        $.toastr.error("抄表失败！");
      });
    },

  }
});

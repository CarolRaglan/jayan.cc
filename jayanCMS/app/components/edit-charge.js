import Ember from 'ember';
import ajax from 'ic-ajax';
export default Ember.Component.extend({
  actions:{
    update(info){
      if(!info.unitPrice){
        $.toastr.error('请输入单价');
        return
      }else if(isNaN(parseFloat(info.unitPrice))){
        $.toastr.error('请输入数字');
        return
      }else if(info.unitPrice>9999.99 ||info.unitPrice<0){
        $.toastr.error('请不要调戏系统，请输入合理单价');
        return
      }
      this.get('auth').registerTokenToAjaxHeader();
      let url =this.get("config").apiUrl1+'prepayment';
      ajax(url, {
        method: 'post',
        data:{
          room:info.roomId,
          power_charge:'prepayment',
          power_unit_price:info.unitPrice
        }
      }).then((res) => {
        $.toastr.success('修改成功');
        this.sendAction('afterUpdate',info);
        this.$('.xsd-modal-close').eq(0).click();
      }).catch(err =>$.toastr.error('修改失败'));
    }
  }
});

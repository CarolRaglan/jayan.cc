import Ember from 'ember';
export default Ember.Component.extend({
  actions: {

    refreshList(type){
      this.sendAction("refreshList",type);
    },
    orderEdit(id){
      this.sendAction('editBill',id);
    },
    guard({has_read_meter,is_meter_need},e){
      if (!has_read_meter && is_meter_need) {
        e.preventDefault();
        e.stopPropagation();
        $.toastr.error('你还有未完成的抄表项<br/>请先完成抄表项.')
        return;
      }
    }

  }

});

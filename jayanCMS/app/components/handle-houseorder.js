import Ember from 'ember';

export default Ember.Component.extend({

  actions: {

    refreshList(type){
      this.sendAction("refreshList",type);
    },
    orderEdit(id){
      this.sendAction('editBill',id);
    }

  }

});

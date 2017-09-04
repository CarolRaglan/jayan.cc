import Ember from 'ember';
export default Ember.Component.extend({
  actions:{
    edit(id){
      this.sendAction('edit',id);
    },
    renew(id){
      this.sendAction('renew',id);
    },
    getHouse(houseId){
      this.sendAction('getHouse',houseId);
    },
    cancelContract(id,e){
      this.sendAction('cancelContract',id,e);
    }
  }
});

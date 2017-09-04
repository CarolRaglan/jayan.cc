import Ember from 'ember';

export default Ember.Component.extend({

  actions:{
    popModal(){
      $("#backRent .xsd-modal-header a").trigger("click");
      $("#cancelContract_btn").trigger("click");
    }
  }
});

import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Controller.extend({
  fresh:true,
  actions:{
    clickBuy(){
      $('#buyTrigger').trigger('click');
    },
  }
});

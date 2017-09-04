import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Route.extend({

  setupController(controller){

    ajax("../version.json",{
      method:"Get",
      async:false,
    }).then((data)=>{

     controller.set("version",data.data);
    })
  }
});

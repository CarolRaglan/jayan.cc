import Ember from 'ember';

export default Ember.Component.extend({

  init(){
    this._super(...arguments);
    let smart = (this.get('smart')||[]).length>0;
    let extras = this.get('extras');
    let info = this.get('info');
    if(!extras){
      return;
    }
    if(info){
      // TODO ADD
    }else{
      extras = extras.filter(it=>it.enable);
    }
    if(smart){
      extras.find(it=>{
        if(it.id==='power'){
          Ember.set(it,'smart',true);
        }
      });
    }
    this.set('extras',extras);
  }

});

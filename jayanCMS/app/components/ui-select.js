import Ember from 'ember';

export default Ember.Component.extend({

  classNames: 'table-cell',
  text:Ember.computed('value',function () {
    let list = this.get('list');
    let value = this.get('value');
    let act = list.find(it => it.code === value) || list[0];
    return act.name;
  }),

  init(){
    Ember.run.next(()=>{
      let value = this.get('value'),list = this.get('list');
      if(list && !value){
        this.set('value',list[0].code);
      }
    });
    this._super(...arguments);
  },

  actions: {

    focus(e){
      this.sendAction('focus',e);
    },

    blur(e){
      this.sendAction('blur',e);
    },

    select(act,e){
      this.set('value',act.code);
      this.sendAction('select',act,e);
    }

  }
});

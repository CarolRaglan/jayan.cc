import Ember from 'ember';
import ajax from 'ic-ajax';
export default Ember.Controller.extend({

  checkedAll:Ember.computed('model.@each.enable',function () {
    let model = this.get('model');
    return model?model.every(it=>it.enable):false;
  }),

  actions:{

    //编辑杂费，切换它是否可用
    edit(it){
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get('config').apiUrl + `utilities_fees/${it.code}`;
      ajax(url,{
        method:'patch',
        data:JSON.stringify({
          pk:it.code,
          enable:it.enable
        }),
        contentType: 'application/json',
      }).catch((e)=>{ //出错则回滚
        Ember.set(it,'enable',!it.enable);
      });
    },

    toggle(prop){
      this.toggleProperty(prop);
    }

  }

});

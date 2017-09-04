import Ember from 'ember';
import ajax from 'ic-ajax';
export default Ember.Controller.extend({

  queryParams: ['name'],
  extrasController:Ember.inject.controller('uc.config.extras'),

  actions:{
    confirm(){
      let name = this.get('name');
      let extrasController = this.get('extrasController');
      let list = extrasController.get('model').toArray();
      let fee = list.find(it=>it.name===name);
      let url = this.get('config').apiUrl + `utilities_fees`;
      if(fee && fee.code){
        this.get('auth').registerTokenToAjaxHeader();
        url += `/${fee.code}`;
        ajax(url,{
          method:'delete',
          contentType: 'application/json'
        }).then((res)=>{
          list = list.filter(it=>it.code!==fee.code);
          extrasController.set('model',list);
          this.transitionToRoute('uc.config.extras');
        }).catch((err)=>{
          let msg = `删除杂费 “${name}” 失败！`;
          if( err && typeof err.errorThrown === 'string' ){
            msg += `<br/>详情：${err.errorThrown}`;
          }
          $.toastr.error(msg);
        });

      }else{
        $.toastr.error(`找不到杂费项“${name}”！`);
        this.transitionToRoute('uc.config.extras');
      }

    }
  }


});

import Ember from 'ember';
import ajax from 'ic-ajax';
export default Ember.Controller.extend({

  extrasController:Ember.inject.controller('uc.config.extras'),

  actions:{
    submit(e){
      e.preventDefault();
      let fee = this.get('fee');
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get('config').apiUrl + `utilities_fees`;
      ajax(url,{
        method:'post',
        data:JSON.stringify({
          fee_name:fee
        }),
        contentType: 'application/json'
      }).then((res)=>{
        if(res.data.atom){
          let extrasController = this.get('extrasController');
          let list = extrasController.get('model').toArray();
          list.push(res.data.atom);
          extrasController.set('model',list);
        }
        this.transitionToRoute('uc.config.extras');
      }).catch((err)=>{
        let msg = `新增杂费失败！`;
        if( err && typeof err.errorThrown === 'string' ){
          msg += `<br/>详情：${err.errorThrown}`;
        }
        $.toastr.error(msg);
      });
    }
  }


});

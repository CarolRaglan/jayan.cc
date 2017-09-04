import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Component.extend({

  didInsertElement:function () {
  },

  actions:{
    setPassword(){
      //表单验证
      if($('#passwordForm').validate()!==true){
        return;
      }
      let _this = this;
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl + "employers/"+this.get('model').id;

      let _params = {};
      _params.password = $('#new_pwd').val();
      ajax(url, {
        method: 'Put',
        data:_params,
      }).then((res) => {
        $.toastr.success("修改成功！");
        $("#editEmployerPassword .xsd-modal-close").trigger('click');

      }).catch((err)=> {
        $.toastr.error("修改失败！");
      });

    }
  }
});

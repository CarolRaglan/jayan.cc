import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Component.extend({
  didInsertElement:function () {
  },

  actions:{

    add(){

      //表单验证
      if($('#addEmployer').validate()!==true){
        return;
      }
      let _this = this;
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl + "employers";
      let _params = {};
      _params.username = $('#phone').val()+"@"+this.get("auth").user.company_postfix;//代表phone
      _params.password = $('#password').val();
      _params.remark = $('#remark').val();
      _params.name = $('#name').val();
      _params.account_type = $('#account_type').val();
      // _params.role=$("#roleName").attr("data-value")
      ajax(url, {
        method: 'Post',
        data:_params,
      }).then((res) => {
        $.toastr.success("添加成功!");
        $("#addEmployer .xsd-modal-close").trigger('click');
        _this.sendAction("staffReload");
      }).catch((err)=> {
        $.toastr.error("添加失败!");
      });
    }
  }
});




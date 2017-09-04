import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Controller.extend({

  city:[],
  errMessage:"",
  actions:{

    profileSet(){

      if($('#user-profile').validate()!==true){
        return;
      }
      let _this = this;
      _this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl + "accounts/"+ this.get("auth").user.id;
      let _params = {};
      _params.company_brand = $('#brand').val();
      _params.company = $('#company_name').val();
      _params.name = $('#name').val();
      _params.province = $('#province').val();
      _params.city = $('#city').val();
      _params.company_postfix = $('#auth_prefix').val();

      ajax(url, {
        method: 'Put',
        data:_params,
      }).then((res) => {

        $.toastr.success('修改成功,重新登录生效!');

      }).catch((err)=> {

        _this.set("errMessage",JSON.parse(err.jqXHR.responseText).errors.detail);
        $.toastr.error('修改失败');
      });
    },

    provinceSelected(e){

      let selectedPro = e.target.value;
      //隐藏选项框
      $(e.target).parent().hide();
      $('#province').val(selectedPro);
      $('#city').val("");
      //改变城市选项
      this.set('city',this.get("auth").cityArr[selectedPro]);
    },

    filter(e){

      let value=$(e.target).val();
      $(e.target).val(value.replace("@",""))
    }
  }
});

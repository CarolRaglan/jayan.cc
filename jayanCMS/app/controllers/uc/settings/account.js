import Ember from 'ember';
import ajax from 'ic-ajax';
import {validate} from '../../../utils/validator';

export default Ember.Controller.extend({

  city:null,
  province:null,

  actions:{

    setActive(selected){
      if(selected.active){
        return;
      }
      this.get('modes').toArray().forEach(it=>{
        if(it.name===selected.name){
          Ember.set(it,'active',true);
        }else if(it.active){
          Ember.set(it,'active',false);
        }
      });
    },

    updateCityList(province,index){
      let auth = this.get('auth');
      let cityList = auth.cityArr[index];
      this.set('cityList',cityList);
      let city = null;
      if(cityList.length==1){
        city = cityList[0];
      }
      this.set('city',city);
    },

    clearTips(it){
      Ember.set(it,'tips',null);
      Ember.set(it,'on',false);
    },

    update(){

      //校验
      if ( !validate({ctx:this,rules:this.get('v')}) ) {
        console.warn('validate failure! \n detail:',this.get('v'));
        return;
      }

      let mode = this.get('modes').toArray().find(it=>it.active);

      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl + "accounts/"+ this.get("auth").user.id;
      let param = {};
      param.company_brand = $('[name=brand]').val();
      param.company = $('[name=company]').val();
      param.name = $('[name=name]').val();
      param.province = $('[name=province]').val();
      param.city = $('[name=city]').val();
      param.company_postfix = $('[name=suffix]').val();
      param.operate_mode = mode.value;

      ajax(url, {
        method: 'Put',
        data:param,
      }).then((res) => {
        $.toastr.success('修改成功,重新登录生效!');
      }).catch((err)=> {
        this.set("errMessage",JSON.parse(err.jqXHR.responseText).errors.detail);
        $.toastr.error('修改失败');
      });
    },

    filter(e){
      let input = $(e.target);
      input.val(input.val().replace("@",""));
    }

  }
});

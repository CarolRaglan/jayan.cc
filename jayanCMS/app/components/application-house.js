import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Component.extend({

  city:[],

  actions: {
    applicationHouse(){
      if ($('#application-house').validate() !== true) {
        return;
      }else{
        if($("#yy_pictures").val()===""){
          $.toastr.error("必须上传营业执照照片!");
          return;
        }else if($("#yy_pictures").val().split(",").length<7){
          $.toastr.error("照片数量不能少于6张!");
          return;
        }
      }
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl1 + "openchannels/apply";
      let _params = {};
      _params.name = $("#apply_name").val();
      _params.wuba_user_name=$("#apply_company_phone").val();
      _params.phone = $("#apply_phone").val();
      _params.province = $("#apply_province").val();
      _params.city = $("#apply_city").val();
      _params.operate_mode=$("#select_module_cla").find(":checked").val();
      _params.legal = $("#apply_legalPerson").val();
      _params.company_name = $("#apply_companyName").val();
      _params.company_id_card = $("#apply_businessNumber").val();
      _params.brand_name = $("#apply_apartmentBrand").val();
      _params.pictures=$("#yy_pictures").val();
      _params.room_count=$("#apartment_mess").val();
      ajax(url, {
        method: 'post',
        data: _params
      }).then((res) => {
        $.toastr.success("申请成功!");
        this.set("app_status",1);
        $("#application-house .xsd-modal-close").trigger('click');
        this.sendAction("roomReload");
      }).catch((err)=> {
        $.toastr.error(err.jqXHR.responseJSON.error);
      });

    },
    provinceSelected(e){
      let selectedPro = e.target.value;
      //隐藏选项框
      $(e.target).parent().hide();
      $('#apply_province').val(selectedPro);
      $('#apply_city').val("");
      //改变城市选项
      this.set('city',this.get("auth").cityArr[selectedPro]);
    },

  }

});

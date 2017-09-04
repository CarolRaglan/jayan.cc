import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Component.extend({
  didInsertElement:function () {
  },
  actions:{
    applySubmit(){
      //表单验证
      if($('#applyLoan').validate()!==true){
        return;
      }
      let _this=this;
      this.get("auth").registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl1+"creditapplications";
      let _params={};
      _params.credit = $("#loan").val();
      _params.name = $("#realName").val();
      _params.id_number=$("#cardId").val();
      _params.address=$("#contactAddress").val();
      _params.phone=$("#phoneNumber").val();
      _params.company=this.$("#companyName").val();

      ajax(url, {
        method: 'Post',
        data:_params,
      }).then((res) => {
        $.toastr.success("提交成功!");
      $("#applyLoan .xsd-modal-close").trigger('click');
    }).catch((err)=> {
        $.toastr.error("已经有在处理的申请了,请不要重复提交!");
    });

    }

  }


});

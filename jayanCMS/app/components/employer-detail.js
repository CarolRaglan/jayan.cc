import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Component.extend({
  canEdit:0,

  didInsertElement:function () {

  },
  actions:{

    doEdit(){
      this.set('canEdit',1);
    },

    cancel() {
      this.set('canEdit',0);
    },

    edit(id){
      let _this = this;
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl + "employers/"+id;
      let _params = {};
      _params.remark = $('#remark').val();
      _params.name = $('#name').val();
      ajax(url, {
        method: 'Put',
        data:_params,
      }).then((res) => {

        $.toastr.success("修改成功！");
        $("#employerDetail .xsd-modal-close").trigger('click');
        _this.sendAction("staffReload");

      }).catch((err)=> {
        $.toastr.error("修改失败！");
      });
      //设置不可编辑
      this.set("canEdit",0);

    }
  }
});

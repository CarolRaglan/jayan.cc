import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Component.extend({

  // flag:false,

  didInsertElement: function () {

    let _this = this;

    $(".del").css("color","#999999");

    $("#addRole input[name='fenP']").click(function () {

      if (!$("#a-crm_manage_edit").is(":checked")) {
        $("#a-crm_manage_del").attr("disabled",true)
        $("#a-crm_manage_del").attr("checked",false)
        $(".del").css("color","#999999");
        $.toastr.error("选择删除客户必须基于分配客户之上");
      }else{
        $("#a-crm_manage_del").removeAttr("disabled")
        $(".del").css("color","#666666");
        $("#a-crm_manage_del").attr("disabled",false)
      };

    })
    $("#addRole label").click(function (e) {
      if(e.target.tagName=='INPUT'){
        let dom = $(e.target);
        window.test =dom;
        if(dom[0].checked){
          dom.parent().parent().parents('.tree-node').each(function(){
            $(this).children('label').first().find('input')[0].checked=true;
          })
        }else{
          if(dom.parent().data('node')=='node'){
            $(this).parent().children('div').find('input').prop("checked", false);
          }
        }
      }
    });

  },


  actions: {

    close(){

      $("#addRole .xsd-modal-header .xsd-modal-close").trigger('click');
    },
    addRole(id, type){
      //表单验证
      if ($('#addRole').validate() !== true) {
        return;
      }
      let data = "";
      $("#addRole input:checked").each(function (i, value) {

        if (data == "") {

          data = $(value).attr("id").split("-")[1];
        } else {

          data = data + ";" + $(value).attr("id").split("-")[1];
        }

      })
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl + "roles/" + id;
      if (type == "POST") {
        url = this.get("config").apiUrl + "roles"
      }
      ajax(url, {
        method: type,
        data: {
          name: $("#add-role").val(),
          page_codes: data,
        },
      }).then((res) => {
        if (type == "POST") {
          $.toastr.success("角色添加成功!");
        } else {
          $.toastr.success("角色修改成功!");
        }

        $("#addRole .xsd-modal-header  .xsd-modal-close").trigger('click');
        this.sendAction("getRoles");//刷新角色列表
      }).catch((err)=> {
        $.toastr.error(err.jqXHR.responseJSON.errors.detail);
      });
    },

  }
});

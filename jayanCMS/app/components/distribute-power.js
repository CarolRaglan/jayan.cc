import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Component.extend({



  didInsertElement: function () {
    let _this = this;

    $(".del").css("color","#999999");

    $("#distributePower input[name='fenP']").click(function () {


      if (!$("#crm_manage_edit").is(":checked")) {
        $("#crm_manage_del").attr("disabled",true)
        $("#crm_manage_del").attr("checked",false)
        $(".del").css("color","#999999");
        $.toastr.error("选择删除客户必须基于分配客户之上");
      }else{

        $("#crm_manage_del").removeAttr("disabled")
        $(".del").css("color","#666666");
        $("#crm_manage_del").attr("disabled",false)
      };

    })
    $("#distributePower label").click(function (e) {
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

  actions:{

    powerSubmit(id){

      let data="";
      $("#distributePower input:checked").each(function (i,value) {

        if(data==""){

          data=$(value).attr("id");
        }else{

          data=data+";"+$(value).attr("id");
        }

      });

      let _this=this;
      _this.get('auth').registerTokenToAjaxHeader();
      let url=this.get("config").apiUrl +"employerpmss/"+id;
      ajax(url,{
        method:"PUT",
        data:{
          page_codes:data,
          role:$("#power-role").attr("data-value"),
        }
      }).then(()=>{

        $.toastr.success("授权成功！");
        $("#distributePower .xsd-modal-close").trigger("click");
        _this.sendAction("staffReload")
      }).catch((xhr)=>{

        $.toastr.error(xhr.jqXHR.responseJSON.errors.detail);

      })

    },

    getRole(id){

        this.get('auth').registerTokenToAjaxHeader();
        let url = this.get("config").apiUrl + "roles/"+id;
        ajax(url, {
          method: 'get',
        }).then((res) => {
          this.set("power.page_codes",res.data.attributes);
        }).catch((err)=> {
        });
      }



  }

});

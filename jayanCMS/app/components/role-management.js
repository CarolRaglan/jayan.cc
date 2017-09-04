import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Component.extend({
  actions:{

    deleteRole(id){

      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl + "roles/"+id;
      ajax(url, {
        method: 'delete',
      }).then((res) => {
        $.toastr.success("删除成功!");
        $("#addRole .xsd-modal-close").trigger('click');
        this.sendAction("getRoles");//刷新角色列表
      }).catch((err)=> {
        $.toastr.error(err.jqXHR.responseJSON.errors.details);
      });
    },

    getRole(id,flag){

      if(flag=="add"){
        this.set("role",null);
      }else{
        this.get('auth').registerTokenToAjaxHeader();
        let url = this.get("config").apiUrl + "roles/"+id;
        ajax(url, {
          method: 'get',
        }).then((res) => {
          this.set("role",res.data.attributes);
          this.set("role.role_id",res.data.id);
        }).catch((err)=> {
        });
      }

    }
  }
});

import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Component.extend({

  actions:{

    delete(type,id){

      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl +type+"/"+ id;
      ajax(url, {
        method: 'Delete'
      }).then((res) => {
        $.toastr.success("删除账单成功!");
        $("#deleteOrder .xsd-modal-header a").trigger("click");
        if(type=="roomorders"){
          if(this.get("optionData").flag){
            $("#roomBack").trigger("click");
          }
          this.sendAction("updateStatus", this.get("optionData").infoId, "room");
        }else{
          if(this.get("optionData").flag){
            $("#roomBack").trigger("click");
          }
          this.sendAction("updateStatus", this.get("optionData").infoId, "house");
        }

      }).catch((err)=> {
        $.toastr.error("删除账单失败!");
      });
    }
  }
});

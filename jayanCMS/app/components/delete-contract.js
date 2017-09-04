import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Component.extend({

  actions:{

    deleteContract(id,type){

      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get('config').apiUrl+ 'roomcontracts/' + id;
      if(type=='house'){
        url=this.get('config').apiUrl+ 'housecontracts/' + id
      }
      ajax(url , {
        method: 'Delete',
        data: {
          "keep": $("#same_delete input:checked").length==1?1:0
        }
      }).then((res) => {

        $.toastr.success('删除成功');
        this.sendAction("updateStatus", this.get("optionData").infoId, type);
        $("#deleteContract .xsd-modal-header .xsd-modal-close").trigger("click");
      }).catch((xhr, err) => {
        $.toastr.error("删除失败");
      });
    }
}
});

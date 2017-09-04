import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Component.extend({

  didInsertElement:function () {

  },
  actions:{

    deleteFinance(id){

      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl1 + "moneyflows/"+ id;
      ajax(url, {
        method: 'delete'
      }).then((res) => {
        $.toastr.success("删除成功!");
        this.sendAction("financeReload");
        $("#deleteFinance .xsd-modal-header .xsd-modal-close,#financeDetail .xsd-drawer-header .xsd-modal-close").trigger("click")
      }).catch((err)=> {

      });
    }
  }
});

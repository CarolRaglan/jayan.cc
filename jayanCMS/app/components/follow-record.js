import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Component.extend({

  didInsertElement:function () {

    let _this=this;
    $("#follow-record").on("click",".xsd-modal-close",function () {
      _this.sendAction("refreshModel");
    });
    $("#xsd-mask").click(function () {
      _this.sendAction("refreshModel");
    });
  },
  actions:{

    deleteRecord(id){

      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl + "customers/"+ id;
      ajax(url, {
        method: 'delete'
      }).then((res) => {
        $.toastr.success("删除成功!");
        this.sendAction("refreshModel");
        $("#deleteRecord .xsd-modal-header .xsd-modal-close,#follow-record .xsd-drawer-header .xsd-modal-close").trigger("click")
      }).catch((err)=> {

      });
    },

    genJinStatus(id){

      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl + "customers/"+ id;

      let data = {
        "new_status": $("#work-status").attr("data-value"), /*跟进中的状态*/
        "comments": $("#work-write").val(), /*备注信息*/
      };
      ajax(url, {
        method:'patch',
        data:data
      }).then((res) => {

        this.sendAction("detail",id);
        $.toastr.success("操作成功!");
        $("#work-write").val("");
      }).catch((err)=> {

      });
    },

    signed(id){
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl + "customers/"+ id;

      let data = {
        "new_status": 7, /*签约*/
      };
      ajax(url, {
        method:'patch',
        data:data
      }).then((res) => {
        $.toastr.success("操作成功!");
        this.sendAction("refreshModel");
        $("#follow-record .xsd-drawer-header .xsd-modal-close").trigger("click");

      }).catch((err)=> {

      });
    },

    getId(id){

      this.set("workId" ,id);
    },
  }


});

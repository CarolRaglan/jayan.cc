import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Component.extend({
  houses:"",
  rooms:"",
  didInsertElement:function () {
    /*释放组件内存*/
    let _this=this;
    $("#addFinance").on("click",".xsd-modal-close",function () {
      _this.set("houses",null);
      _this.set("rooms",null);
    })
  },
  actions:{

    search(e){

      let _this=this;
      this.get('auth').registerTokenToAjaxHeader();
      let url=this.get("config").apiUrl+"houses/brief?search="+$(e.target).val();
      ajax(url, {
        method: 'Get'
      }).then((res) => {
        _this.set("houses", res.data.attributes.houses);
      }).catch((err)=> {
        $.toastr.error("服务器错误!");
      });
    },

    clickLi(obj,e){

      $(e.target).parent().prev().attr("data-value",$(e.target).attr("data-value"));
      $(e.target).parent().prev().val($(e.target).text());
      $(e.target).parent().hide();
      this.set("rooms",obj);
      return false;
    },

    addFinance(){
      if($('.finance-form').validate()!==true){
        return;
      }
      let _this=this;
      this.get('auth').registerTokenToAjaxHeader();
      let url=this.get("config").apiUrl1+"moneyflows";
      //防止重复提交
      if(this.get("processing")==true){
        $.toastr.error("处理中,请稍等");
        return;
      }
      this.set("processing",true);
      
      let data={
         "flow_type":$("#a_flow_type").attr("data-value"),
         "trader_name":$("#trader_name").val(),
         "house_id":$("#a_house_id").attr("data-value"),
         "room_id":$("#a_room_id").attr("data-value"),
         "pay_method":$("#a_pay_method").attr("data-value"),
         "trade_serial_no":$("#a_trade_serial_no").val(),
         "trade_at":$("#gen_at").val(),
         "remark":$("#f_comment").val()
      }
      data[$("#a_fee_type").attr("data-value")]=$("#a_fee").val();
      ajax(url, {
        method: 'post',
        data:data
      }).then((res) => {
        $.toastr.success("添加成功!");
        $("#addFinance .xsd-modal-close").trigger("click");
        _this.sendAction("financeReload");
        _this.set("houses",null);
        _this.set("rooms",null);
        //防止重复提交
        this.set("processing",false);
      }).catch((err)=> {
        $.toastr.error(err.jqXHR.responseJSON.errors.detail);
        //防止重复提交
        this.set("processing",false);
      });

    }

  }
});

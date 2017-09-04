import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Component.extend({
  order_edit:"",
  order_detail:"",
  didInsertElement:function () {

    let _this=this;
    $("#orderHistory").on("click",".xsd-modal-close",function () {

      _this.set("order_detail",false);
      _this.set("order_edit", false);
      _this.set("flag",false);

    })
  },
  actions:{

    getOrder(id,type){

      this.set("order_detail",true);
      if(type=="house"){
        this.sendAction("getHouseOrder",id)
      }else{
        this.sendAction("getRoomOrder",id)
      }
    },

    lookBack(){
      this.set("order_detail",false);
      this.set("order_edit",false);
      this.sendAction("getHistroy", this.get("orders").start_time, this.get("orders").end_date, "order");
    },

    orderEdit(){
      this.set("order_edit",true);
    },

    editHouseBill(id){

      if($('#history_house_orderDetail_form').validate()!==true){
        return;
      }
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl + "houseorders/" + id;

      let data = {
        "contract_id": this.get("orderDetail").attributes.contract_id,
        "start_time": this.get("orderDetail").attributes.start_time,
        "end_time": this.get("orderDetail").attributes.end_time,
        "ought_pay_time": this.get("orderDetail").attributes.ought_pay_time.replace(/\./g, "-"),
        "water_fees": this.$("#history_ho_water_fees").val(),
        "power_fees": this.$("#history_ho_power_fees").val(),
        "gas_fees": this.$("#history_ho_gas_fees").val(),
        "property_fees": this.$("#history_ho_property_fees").val(),
        "service_fees": this.$("#history_ho_service_fees").val(),
        "cleaning_fees": this.$("#history_ho_cleaning_fees").val(),
        "upkeep_fees": this.$("#history_ho_upkeep_fees").val(),
        "material_fees": this.$("#history_ho_material_fees").val(),
        "catv_fees": this.$("#history_ho_catv_fees").val(),
        "internet_fees": this.$("#history_ho_internet_fees").val(),
        "sanitation_fees": this.$("#history_ho_sanitation_fees").val(),
        "free_fees": this.$("#history_ho_free_fees").val(),
        "other_fees": this.$("#history_ho_other_fees").val()
      };
      ajax(url, {
        method: 'PATCH',
        data:data
      }).then((res) => {

        $.toastr.success("编辑账单成功!");
        this.sendAction("getHouseOrder",id)
        this.set("order_edit", false);
        this.set("flag",true);

      }).catch((err)=> {

        $.toastr.error("编辑账单失败!");
      });

    },

    editRoomBill(id){

      if($('#history_room_orderDetail_form').validate()!==true){
        return;
      }
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl + "roomorders/" + id;

      let data = {
        "contract_id": this.get("order").attributes.contract_id,
        "start_time": this.get("order").attributes.start_time,
        "end_time": this.get("order").attributes.end_time,
        "ought_pay_time": this.get("order").attributes.ought_pay_time.replace(/\./g, "-"),
        "water_fees": this.$("#history_ro_water_fees").val(),
        "power_fees": this.$("#history_ro_power_fees").val(),
        "gas_fees": this.$("#history_ro_gas_fees").val(),
        "property_fees": this.$("#history_ro_property_fees").val(),
        "service_fees": this.$("#history_ro_service_fees").val(),
        "cleaning_fees": this.$("#history_ro_cleaning_fees").val(),
        "upkeep_fees": this.$("#history_ro_upkeep_fees").val(),
        "material_fees": this.$("#history_ro_material_fees").val(),
        "catv_fees": this.$("#history_ro_catv_fees").val(),
        "internet_fees": this.$("#history_ro_internet_fees").val(),
        "sanitation_fees": this.$("#history_ro_sanitation_fees").val(),
        "free_fees": this.$("#history_ro_free_fees").val(),
        "other_fees": this.$("#history_ro_other_fees").val()
      };
      ajax(url, {
        method: 'PATCH',
        data:data
      }).then((res) => {

        $.toastr.success("编辑账单成功!");
        this.sendAction("getRoomOrder",id)
        this.set("order_edit", false);
        this.set("flag",true);

      }).catch((err)=> {

        $.toastr.error("编辑账单失败!");
      });

    },
  }
});

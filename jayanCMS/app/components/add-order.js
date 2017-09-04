import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Component.extend({

  status: false,
  payType:"收入",
  change:false,
  data: "",
  deposit:0,
  processing:false,

  actions: {

    feesType(e){

      if ($(e.target).attr("data-value") == "支") {
        this.set("change", false);
      } else {
        this.set("change", true);
      }
      $(e.target).parent().prev().val($(e.target).text());
      $(e.target).parents(".xsd-select").next().find("input").attr("data-value", $(e.target).attr("data-value"));
      $(e.target).parent().hide();
      return false;
    },
    wordLimits(){
      let value=$("#roomNoteEdit").val();
      if(value.length>50){
        $("#roomNoteEdit").val(value.substring(0,50));
        $.toastr.error("账单备注（50字以内）");
      }
    },
    addOrderSure(){

      if ($('#add-order').validate() !== true) {
        return;
      }
      this.get('auth').registerTokenToAjaxHeader();
      //防止重复提交
      if(this.get("processing")==true){
        $.toastr.error("处理中,请稍等");
        return;
      }
      this.set("processing",true);
      let url,
      data={
        "start_time":this.$("input[name='order_startTime']").val(),
        "end_time":this.$("input[name='order_stopTime']").val(),
        "ought_pay_time":this.$("input[name='should_pay']").val(),
        "comments":this.$("#roomNoteEdit").val(),
        "amount": this.$("input[name='order_room_rent']").attr("data-value") == "支" ? -this.$("#order_room_rent").val() : +this.$("#order_room_rent").val(),
        "deposit": this.$("input[name='order_room_pay']").attr("data-value") == "支" ? -this.$("#order_room_pay").val() : +this.$("#order_room_pay").val(),
        "water_fees": this.$("input[name='order_fees_water']").attr("data-value") == "支" ? -this.$("#order_fees_water").val() : +this.$("#order_fees_water").val(),
        "power_fees": this.$("input[name='order_fees_power']").attr("data-value") == "支" ? -this.$("#order_fees_power").val() : +this.$("#order_fees_power").val(),
        "gas_fees": this.$("input[name='order_fees_gas']").attr("data-value") == "支" ? -this.$("#order_fees_gas").val() : +this.$("#order_fees_gas").val(),
        "property_fees": this.$("input[name='order_fees_property']").attr("data-value") == "支" ? -this.$("#order_fees_property").val() : +this.$("#order_fees_property").val(),
        "service_fees": this.$("input[name='order_fees_service']").attr("data-value") == "支" ? -this.$("#order_fees_service").val() : +this.$("#order_fees_service").val(),
        "cleaning_fees": this.$("input[name='order_fees_clean']").attr("data-value") == "支" ? -this.$("#order_fees_clean").val() : +this.$("#order_fees_clean").val(),
        "upkeep_fees": this.$("input[name='order_fees_repair']").attr("data-value") == "支" ? -this.$("#order_fees_repair").val() : +this.$("#order_fees_repair").val(),
        "material_fees": this.$("input[name='order_fees_material']").attr("data-value") == "支" ? -this.$("#order_fees_material").val() : +this.$("#order_fees_material").val(),
        "catv_fees": this.$("input[name='order_fees_tv']").attr("data-value") == "支" ? -this.$("#order_fees_tv").val() : +this.$("#order_fees_tv").val(),
        "internet_fees": this.$("input[name='order_fees_broadband']").attr("data-value") == "支" ? -this.$("#order_fees_broadband").val() : +this.$("#order_fees_broadband").val(),
        "sanitation_fees": this.$("input[name='order_fees_health']").attr("data-value") == "支" ? -this.$("#order_fees_health").val() : +this.$("#order_fees_health").val(),
        "free_fees": this.$("input[name='order_fees_discount']").attr("data-value") == "支" ? -this.$("#order_fees_discount").val() : +this.$("#order_fees_discount").val(),
        "other_fees": this.$("input[name='order_fees_other']").attr("data-value") == "支" ? -this.$("#order_fees_other").val() : +this.$("#order_fees_other").val(),
      };

      var _this = this;


      if (this.get("status") == true) {
        _this.set("status", false);
        return;
      }

      if(this.get("room")){
        url=this.get("config").apiUrl + "roomorders";
        data.contract_id=this.get("room").contract.id;
      }else{
        url=this.get("config").apiUrl + "houseorders";
        data.contract_id=this.get("house").contract.id;
      }

      ajax(url, {
        method: 'Post',
        data:data
      }).then((res) => {
        //防止重复提交
        this.set("processing",false);
        $.toastr.success("添加成功！");
        this.$("#add-order .xsd-modal-close").trigger("click");
        if(this.get("room")){
          this.sendAction("updateStatus",this.get("room").room.id,"room");
        }else{
          this.sendAction("updateStatus",this.get("house").house.id,"house");
        }
      }).catch((err)=> {
        $.toastr.error(validate(err));
        //防止重复提交
        this.set("processing",false);
      });

    },




  },

});

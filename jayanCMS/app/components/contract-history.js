import Ember from 'ember';

export default Ember.Component.extend({
  flag:false,
  contract_detail:false,
  didInsertElement:function () {

    let _this=this;
    $("#contractHistory").on("click",".xsd-modal-close",function () {

      _this.set("contract_detail",false);

    })
  },
  actions:{

    renew(){

      $.toastr.error("您有未处理完账单,暂时无法续租");
    },

    getContract(id,type){

      this.set("contract_detail",true);
      if(type=="house"){
        this.sendAction("getHouseContract",id)
      }else{
        this.sendAction("getRoomContract",id)
      }
    },

    lookBack(){

      this.set("contract_detail",false);
      this.sendAction("getHistroy", this.get("contracts").start_time, this.get("contracts").end_date, "order");
    },

    contractEdit(){

      this.set("contract_detail",true);
    },

  }
});

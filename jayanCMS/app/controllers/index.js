import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Controller.extend({
  rDetail:{},
  order:"",
  contract:"",
  refreshCancel:true,
  loan:"",
  contracts: "",
  orders: "",
  args:{},
  refreshRoomContract:true,
  refreshHouseContract:true,
  contractHistroy:"",
  orderHistroy:"",
  actions:{

    gotoRent(){

      $("#separate-management_a").trigger("click");
      this.get("router").transitionTo("rental.separate-management")
    },


    getRoomOrder(id){

      let _this=this;
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl + "roomorders/"+id;
      ajax(url, {
        method: 'Get'
      }).then((res) => {

        _this.set("order", res.data);

      }).catch((err)=> {

      });

    },

    getHouseOrder(id){

      let _this=this;
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl + "houseorders/"+id;
      ajax(url, {
        method: 'Get'
      }).then((res) => {

        _this.set("order", res.data);

      }).catch((err)=> {

      });

    },

    getOrders(data){

      let _this = this;
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl1+ "todos/order";
      ajax(url, {
        method: 'Get',
        data: data

      }).then((res) => {
        _this.set("orders", res);

      }).catch((err)=> {

        // $.toastr.error("获取账单数据失败!")
      });

    },

    getContracts(data){

      let _this = this;
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl1 + "todos/contract";
      ajax(url, {
        method: 'Get',
        data: data

      }).then((res) => {
        _this.set("contracts", res);
      }).catch((err)=> {

        // $.toastr.error("获取合同数据失败!")
      });

    },


    getHouseContract(id){

      let _this=this;
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl+ "housecontracts/"+id;
      ajax(url, {
        method: 'Get',
        async:false,
      }).then((res) => {
        let contract_data={};
        contract_data.contract=res.data.attributes;
        contract_data.area=res.data.attributes.location;
        contract_data.address=res.data.attributes.address;

        _this.set("contract_data", contract_data);
        _this.set("contract", res.data.attributes);
        _this.send("refresh","refreshHouseContract")

      }).catch((err)=> {

      });

    },

    getRoomContract(id){

      let _this=this;
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl+ "roomcontracts/"+id;
      ajax(url, {
        method: 'Get',
        async:false,
      }).then((res) => {

        let contract_data={};
        contract_data.contract=res.data.attributes;
        contract_data.area=res.data.attributes.location;
        contract_data.address=res.data.attributes.address;
        contract_data.name=res.data.attributes.name;

        _this.set("contract_data", contract_data);
        _this.set("contract", res.data.attributes);
        _this.send("refresh","refreshRoomContract")

      }).catch((err)=> {

      });

    },

    refreshList(type){

      if(type=="contract"){
        this.send("getContracts",this.get("args"));
      }else{
        this.send("getOrders",this.get("args"));
      }

    },

    refresh(type){

      let _this=this;
      this.set(type, false);
      Ember.run.next(function () {
        _this.set(type, true);
      });
    },

    //获取历史账单历史合同
    getHistroy(start_date,end_date,type){

      this.get('auth').registerTokenToAjaxHeader();
      let url;
      if(type=="contract"){
        url = this.get("config").apiUrl1 + "monthcount_contracts";
      }else{
        url = this.get("config").apiUrl1 + "monthcount_orders";
      }

      ajax(url, {
        method: 'Get',
        data: {
          start_date: start_date,
          end_date: end_date
        }

      }).then((res) => {

        if(type=="contract") {
          this.set("contractHistroy", res);
        }else{
          this.set("orderHistroy", res);
        }

      }).catch((err)=> {

        // $.toastr.error("获取合同统计数据失败!")

      });
    },



  }
});

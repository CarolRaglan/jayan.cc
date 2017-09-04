import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Controller.extend({
  fees:null,
  type: "rent",
  queryParams: ['keyword', 'city', 'district', 'block', 'area', 'house_id', 'filter1', 'filter2', 'sort', 'page', 'perPage'],
  houseIndex: 1,
  roomsIndex: 1,
  room: "",
  house: "",
  contract: "",
  refreshRoom: true,
  refreshHouse: true,
  refreshMeter: true,
  refreshAddHouse: true,
  refreshCancel: true,
  refreshHouseDetail: true,
  refreshRoomDetail: true,
  refreshBill:false,
  roomstep: "step1",
  housestep: "step1",
  isDrawer: false,
  order: "",
  bill: "",
  page: 1,
  perPage: 12,
  sort: "ro_pay",
  profit:"",
  profit_id:"",
  profit_location:"",
  signalData:null,
  optionData:null,
  areaName:"total",//默认全部小区
  detailObserver: Ember.observer('signalData', function () {

    if(this.get('isDrawer')){
        if(this.get("signalData").type=="room"){
          this.send("getRoom", this.get("signalData").id);
        }else{
          this.send("getHouse", this.get("signalData").id);
        }
    }else{
      this.send("modelReload");
      this.set("signalData",null);
    }

  }),
  actions: {
    pageChanged(page){

      this.set('page',page);

    },
    tabIndex(type, num, id){
      if (num == 1&&type=="house") {
        this.set("houseIndex",1);
      }
      if (type == "house") {
        this.send("getHouse", id);
        this.send('refresh', "refreshHouseDetail");
        $($("#houseDetail .xsd-nav-tabs li")[num - 1]).trigger("click");
        $("#houseDetail_btn").trigger("click");
      } else {
        $($("#roomDetail .xsd-nav-tabs li")[num - 1]).trigger("click");
        $("#roomDetail_btn").trigger("click");
        this.send('refresh', "refreshRoomDetail");
        this.send("getRoom", id);
      }
    },

    // 在模态窗中编辑合同
    editCustomerContract(roomId){
      this.send("getRoomInfos",roomId ,true);
    },

    editOwnerContract(){
      this.send('refresh','refreshHouse');
      $('.trigger-contract-owner-edit').click();
    },

    renewOwnerContract(){
      this.send('refresh','refreshHouse');
    },


    // 新增或者续租
    renew(id,flag,e){

      if(flag){
        this.send("getRoomInfos",id ,true);
        $("#rentalRoom_btn").click();
      }else{
        $.toastr.error("您有未处理完账单,暂时无法续租");
      }

      e.stopPropagation();

    },
    getRoomInfos(id,type){

      this.set("roomstep","step1");
      if(type){

        this.send("getRoom",id);
      }
      this.send('refresh', "refreshRoom");
    },

    getRoom(id){

      let _this = this;
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl1 + "roominfos/" + id;
      ajax(url, {
        method: 'Get',
        async: false,
      }).then((res) => {

        _this.set("room", res.data.attributes);

      }).catch((err)=> {

      });
    },
    delRoom(id,del){

      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl + "rooms/" + id+"?is_delete_moneyflow="+del;
      ajax(url, {
        method: 'Delete'


      }).then((res) => {
        $.toastr.success("删除成功!");
        this.send("houseReload");
         $("#deleteRoom .xsd-modal-header .xsd-modal-close").trigger("click");
         $("#roomDetail .xsd-drawer-header .xsd-modal-close").trigger("click");

      }).catch((err)=> {
        $.toastr.error(err.jqXHR.responseJSON.errors.detail);
      });

    },

    //之前的getRoomOrder扩展性不好，现在需要加一个参数，无法复用。现在这里添加了一个孪生方法
    getRoomOrder2({ro_id,has_read_meter,is_meter_need},is_meter,type,e){
      if(!has_read_meter&&is_meter_need){
        e.preventDefault();
        e.stopPropagation();
        $.toastr.error('你还有未完成的抄表项<br/>请先完成抄表项.')
        return;
      }
      this.send('getRoomOrder',ro_id,is_meter,type,e);
    },


    getRoomOrder(id,is_meter, type, e){
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl + "roomorders/" + id+"?is_meter="+is_meter;
      ajax(url, {
        method: 'Get'
      }).then((res) => {
        if(is_meter){
          $('#readMeter_btn').click();
          this.send('refresh', "refreshMeter");
        }
        this.set("order", res.data);
        this.set("bill", res.data);
      }).catch((err)=> {

      });

      e && e.stopPropagation();

      if (type == "send") {
        $("#sendOrder_btn").trigger("click");
      }else if(type=="get"){
        $("#confirmRent-trigger").trigger("click");
      }

    },
    getHouseInfos(id, type){

      let _this = this;
      this.set("housestep", "step1");
      if (type) {

        this.send("getHouse", id);
      }

      this.send('refresh', "refreshHouse");

    },

    getHouse(id){

      let _this = this;
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl1 + "houseinfos/" + id;
      ajax(url, {
        method: 'Get',
        async: false,
      }).then((res) => {

        _this.set("house", res.data.attributes);

      }).catch((err)=> {

      });
    },

    getHouseContract(id,flag, e){

      let _this = this;
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl + "housecontracts/" + id;
      ajax(url, {
        method: 'Get'
      }).then((res) => {

        _this.set("contract", res.data.attributes);
        _this.send('refresh', "refreshCancel");
        if(flag){
          this.set("optionData",{num:res.data.attributes.un_confirm_order_num});
          $("#back_rent").trigger("click");
        }else {
          $("#cancelContract_btn").trigger("click");
        }

      }).catch((err)=> {

      });
      e.stopPropagation();
    },

    fetchRoomContract(id,invoke){
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl + "roomcontracts/" + id;
      ajax(url, {
        method: 'Get'
      }).then(invoke).catch((err)=> {
        $.toastr.error('获取房间信息失败');
      });
    },

    getRoomContract(id,flag, e){
      this.send('fetchRoomContract',id,(res)=>{
        this.set("contract", res.data.attributes);
        this.send('refresh', "refreshCancel");
        if(flag){
          this.set("optionData",{num:res.data.attributes.un_confirm_order_num});
          $("#back_rent").trigger("click");
        }else {
          $("#cancelContract_btn").trigger("click");
        }
      });
      e && e.stopPropagation();
    },

    refresh(type){

      if (type ==="refreshHouseDetail" || type ==="refreshRoomDetail") {
        this.set("isDrawer", true);
      }
      this.set(type, false);
      Ember.run.next( () => {
        this.set(type, true);
      });
    },

    //处理盈利状况
    getProfit(id,area,name){
      $("#profitAnalysis .xsd-nav-tabs li:first-child").trigger("click");
      this.set("profit_id",id);
      this.set("profit_location",area+name);
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl1 + "housemoneyflows/" + id;
      ajax(url, {
        method: 'Get',
        // async:false,
      }).then((res) => {

        this.set("profit", res.data.attributes.houses);

      }).catch((err)=> {
        $.toastr.error('获取盈情况失败');
      });
    },
    selectFilter(key,value){
      let filter1,filter2="";
      if(key==='filter1'){
        filter1 = value;
      }
      if(key==='filter2'){
        filter2 = value;
      }
      let params = {
        filter1: filter1,
        filter2: filter2,
        page: 1,
      };
      this.send("transition",params);
    },
    selectSearch(){
      let keywords = $('#search').val();
      let params = {
        keyword: keywords,
        city: "",
        district: "",
        block: "",
        area: "",
        house_id: "",
        filter1: "",
        filter2: "",
        page: 1,
      };
      this.send("transition",params);

    },
    transition(params){
      this.get("router").transitionTo({
        queryParams: params
      })
    },
   // 添加房源
    addRoom(id){

      this.get('auth').registerTokenToAjaxHeader();
      let url=this.get("config").apiUrl+"rooms";
      ajax(url, {
        method: 'post',
        data:{
          "house_id":id,
        }
      }).then((res) => {
        $.toastr.success("添加成功");
        this.send("houseReload");

      }).catch((err)=> {

        $.toastr.error(validate(err));
      });
    },
      //当前路由刷新
    houseReload(){
      this.send("areaReload");
      this.send('reloadModel');
    },
    //当前列表刷新
    modelReload(){
      if (!this.get("isDrawer")) {
        // this.get('model').forEach(function (record) {
        //   record.reload();
        // });
        this.send("reloadModel");
      }
    },
    areaReload(){
      $('#areaListRefresh').trigger("click");
    },
    //更新状态传递
    updateStatus(id,type){
      let args={};
      args.id=id;
      args.type=type;
      this.set("signalData", args);
    },
    nopower(e){
      $.toastr.error("抱歉!你没有该权限");
      e.stopPropagation();
    },

    fetchRoomOrder(id,invoke){
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl + "roomorders/" + id;
      ajax(url, {
        method: 'get'
      }).then(invoke).catch((err)=> {
        $.toastr.error('获取账单失败');
      });
    },

    fetchHouseOrder(id,invoke){
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl + "houseorders/" + id;
      ajax(url, {
        method: 'get'
      }).then(invoke).catch((err)=> {
        $.toastr.error('获取账单失败');
      });
    },

    editCustomerBill(id){
      this.send('fetchRoomOrder',id,(res)=>{
        this.set('order',res.data.attributes);
        this.send('refresh','refreshBill');
        $('#editBill_btn').click();
      });
    },

    editOwnerBill(id){
      this.send('fetchHouseOrder',id,(res)=>{
        this.set('order',res.data.attributes);
        this.send('refresh','refreshBill');
        $('#editBill_btn').click();
      });
    },

    addCustomerBill(){
      let {customer_name,id:contract_id,room:room_id} = this.get('room.contract');
      this.set('order',{customer_name,contract_id,room_id});
      $('#editBill_btn').click();
      this.send('refresh','refreshBill');
    },

    addOwnerBill(){
      let {owner_name,id:contract_id,house:house_id} = this.get('house.contract');
      this.set('order',{owner_name,contract_id,house_id});
      $('#editBill_btn').click();
      this.send('refresh','refreshBill');
    }

  }
});

import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Component.extend({

  monthsY: [0, 1, 2, 3],
  monthsF: [{num:1,text:"月付"},
    {num:2,text:"2月付"}, {num:3,text:"季付"},
    {num:4,text:"4月付"}, {num:5,text:"5月付"},
    {num:6,text:"半年付"}, {num:7,text:"7月付"},
    {num:8,text:"8月付"}, {num:9,text:"9月付"},
    {num:10,text:"10月付"}, {num:11,text:"11月付"}, {num:12,text:"年付"}],
  editRoom: false,
  editContract: true,
  editAll: true,
  imgFlag:true,
  order_detail: false,
  orderDetail: "",
  laterDetail: true,
  isPart: false,
  flag:false,
  water_type: "fixed",
  power_type: "fixed",
  power_type_text: "按固定费用",
  water_type_text: "按固定费用",
  payType: "收入",
  change: false,
  part: false,
  data: "",
  deposit: 0,
  contractDetail:false,
  historyContract:null,
  powerChargeEditItem:{},
  protocol:{},

  didInsertElement: function () {

    /*
     *更改时间:2016-09-19
     *更改人:jo
     *说明:抽屉状态管理,还有优化空间
     * */
    let _this = this;
    $("#roomDetail").on("click", ".xsd-modal-close", function () {
      clearStatus()
    });
    $("#xsd-mask").click(function () {
      clearStatus()
    });

    function clearStatus() {

      _this.set("order_detail", false);
      _this.set("orderDetail", "");
      _this.set("isDrawer", false);
      _this.set("editRoom", false);
      _this.set("editContract", true);
      _this.set("editAll", true);
      _this.set("water_type_text", "按固定费用");
      _this.set("power_type_text", "按固定费用");
      _this.set("water_type", "fixed");
      _this.set("power_type", "fixed");
      _this.set("part", false);
      _this.set("room", null);
      if (_this.get("signalData")) {
        _this.sendAction("modelReload");
        _this.set("signalData", null);
      }
    }

  },

  actions: {
    getProtocolData(id){
      this.get('auth').registerTokenToAjaxHeader();
      let url =this.get("config").apiHost+'/internal/api/signed_content?contract_id='+id;
      ajax(url, {
        method: 'get',

      }).then((res) => {
        let created_at=res.contract_created_at.split("-");
        let signed_at=res.contract_signed_at.split("-");
        res.contract_created_at=created_at[0]+'年'+created_at[1]+'月'+created_at[2]+'日';
        res.contract_signed_at=signed_at[0]+'年'+signed_at[1]+'月'+signed_at[2]+'日';
        this.set("protocol",res);

      }).catch((xhr, err) => {
        $.toastr.error('修改失败')
      });

    },


    picker(num){

      let end = this.$("#update_contract_end_time").val();
      let picker = new Pikaday({
        field: $('#datepickerRoom' + num + " input[name='partEndTime']")[0],
        minDate: new Date($('#datepickerRoom' + num + " input[name='partStartTime']").val()),
        // maxDate: new Date(end),
        format: "YYYY-MM-DD",
        onSelect: function () {

        }
      });
    },

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

    deposit(num){
      this.$("#update_contract_deposit").val(this.$("#update_contract_month_rental").val() * num)
    },

    deleteContract(id,infoId){
      let args={};
      args.id=id;
      args.type="room";
      args.infoId=infoId;
      this.set("optionData",args);
      this.set('contractDetail',false);
    },
    delRoom(id){
      let deleteMoneyFlow=$("#deleteMoneyFlow").is(":checked");
      this.sendAction("delRoom",id,deleteMoneyFlow);

    },
    edit(type,flag){
      this.set("imgFlag",false);
      if (type == "room") {
        this.set("editRoom", true);
      }
    },

    editContract(roomId){
      this.sendAction('editContract',roomId);
    },

    renew(){
      $.toastr.error("您有未处理完账单,暂时无法续租");
    },
    roomNotes(){

       if($("#roomNoteEdit").val()=="房间备注（100字以内）"){

           $("#roomNoteEdit").val("");
       }
    },
    wordLimit(){
      let value=$("#roomNoteEdit").val();
      if(value.length>100){
        $("#roomNoteEdit").val(value.substring(0,100));
        $.toastr.error("房间备注（100字以内）");
      }
    },
    saveRoom(id){

      if ($('#edit_room_form').validate() !== true) {
        return;
      }
      let _this = this;
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get('config').apiUrl;
      ajax(url + 'rooms/' + id, {
        method: 'patch',
        data: {
          "name": _this.$("#d_room_name").val(),
          "remark":_this.$("#roomNoteEdit").val()
        }
      }).then((res) => {

        $.toastr.success('修改成功');
        _this.set("editRoom", false);
        _this.sendAction("updateStatus", id, 'room');
      }).catch((xhr, err) => {
        $.toastr.error(xhr.jqXHR.responseJSON.errors.detail);
      });
    },
    printBill(){
      window.print();
    },
    cloneContract(){
      let frag = this.$('#tab-2 .list-info').clone();
      $("#printContract-con").html(frag);
    },
    resetCon(){

      $("#printContract-con").html("");

    },
    printContract(){
      window.print();
    },

    prePayMent(roomId){
      let eleTr=$("#eletr").val();
      let sty=$("#clickToggler").css("display");
      let url = this.config.apiUrl1 + "prepayment";
      this.get('auth').registerTokenToAjaxHeader();

      ajax(url, {
        data: {
          "room": roomId,
          "power_charge": "prepayment",
          "power_unit_price":eleTr
        },
        method: 'post'
      }).then((res) => {
        $("#xsd-ser-btn").hide();
        $("#powerModifyToggler .xsd-modal-close").trigger('click');
      }).catch((err) => {
        $.toastr.error(err.jqXHR.responseJSON.errors.detail);
      });
    },

    confirmRent({id,has_read_meter,is_meter_need},e){
      if(!has_read_meter&&is_meter_need){
        e.preventDefault();
        $.toastr.error('你还有未完成的抄表项<br/>请先完成抄表项.');
        return;
      }
      $("#confirmRent-trigger").trigger("click");
      this.send("getOrder", id, "");
    },

    switch_pay_way(flag){
      this.set("room.contract.rent_pay_way", flag);
    },

    selectPayMethod(e){
      let value = $(e.target).attr("data-value");
      let type = $(e.target).parent().attr("data-type");
      if (type == "power") {
        this.set("power_type_text", $(e.target).text());
        this.set("power_type", value);
      } else if (type == "water") {
        this.set("water_type", value);
        this.set("water_type_text", $(e.target).text());
      } else if (type == "deposit") {
        this.send("deposit")
      }
    },

    cancel(id,flag,e){
      this.sendAction("getContract", id,flag,e)
    },

    lookOrder(id, type,infoId,flag){
      if (type == "roomorders") {
         let args={};
             args.id=id;
             args.type=type;
             args.infoId=infoId;
             args.flag=flag;
         this.set("optionData",args);
      } else {
        this.set("order_detail", true);
        this.send("getOrder", id, type, true)
      }
    },

    lookBack(type){
      if(type==='historyContract'){
        this.set('contractDetail',false);
        this.set('historyContract',null);
      }else{
        this.set("order_detail", false);
        this.set("orderDetail", "");
      }
    },

    getOrder(id, type, checkAble){
      let _this = this;
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl + "roomorders/" + id;
      ajax(url, {
        method: 'Get'
      }).then((res) => {

        if (checkAble) {

          _this.set("orderDetail", res.data.attributes);
          if (type == "later") {

            _this.set("laterDetail", false);
          } else {

            _this.set("laterDetail", true);
          }

        } else {

          _this.set("bill", res.data);
        }

      }).catch((err)=> {
        $.toastr.error("获取账单失败!");
      });
    },

    refresh( type ){
      this.set(type, false);
      Ember.run.next( () => {
        this.set(type, true);
      });
    },

    editBill(id){
      this.sendAction('editBill',id);
    },

    sendBill({id,has_read_meter},is_meter,e){
      if(has_read_meter===false){
        e.preventDefault();
        $.toastr.error('你还有未完成的抄表项<br/>请先完成抄表项.');
        return;
      }
      this.sendAction("obtainOrder", id, is_meter,e);
    },

    getRoomOrder(id, is_meter,e){
      this.sendAction("obtainOrder", id, is_meter,e);
    },

    getRoomContract(id){
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get('config').apiUrl;
      ajax(url + 'roomcontracts/' + id, {
        method:'Get'
      }).then((res)=>{
        this.set('contractDetail',true);
        this.set('historyContract',res.data.attributes);
      }).catch((err)=>{
        $.toastr.error("获取历史合同失败!");
      });
    },

    addBill(){
      this.sendAction('addBill');
    },

    //切换电费收费类型
    switchChargeType(contract){
      this.set('powerChargeEditItem',{roomId:contract.room,unitPrice:null});
      $('#trigger-editCharge').click();
    },

    //切换电费收费类型成功后的回调
    afterPowerChargeUpdate({roomId}){
      this.sendAction('getRoom',roomId);
    }

  }
});

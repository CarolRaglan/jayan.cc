/*
 * 书写人:jo.li
 * 说明:首页日历模块代码
 * */
import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Component.extend({
  calendar: "",
  c_data: {
    year: "",
    month: "",
    day: "",
    is_today: true
  },
  isToday:false,
  flag: true,
  today: "",
  index: 1,
  statistics:{"empty":32},
  /*以下属性与操作面板相关*/
  contentStats:{
    room_contract_num: 0,
    room_order_num: 0,
    house_contract_num: 0,
    house_order_num: 0
  },
  content_list:"",
  //请求content接口,参数暂存
  contentParams:{
    year: "",
    month: "",
    day: "",
    is_today: true,
    mark:"today",
    view:"RoomRentOrder"   //枚举 RoomContract/RoomRentOrder/HouseContract/HouseRentOrder
  },
  //确认账单,传入confirmRent组件对象
  bill:"",
  //合同操作,传入cancel-contract组件
  roomstep: "step1",
  housestep: "step1",
  room: "",
  house: "",
  contract:"",
  refreshCancel:true,
  refreshRoom: true,
  refreshHouse: true,
  refreshBill:false,
  //loading
  loading:true,
  didInsertElement: function () {

    //日历下面列表高度
    let b_height = $("body").height() - 462;
    $("#calendar .list").css("height", b_height + "px")
    $(window).resize(function () {
      let b_height = $("body").height() - 462;
      $("#calendar .list").css("height", b_height + "px")
    });
    //获取日历格式
    this.send("getRecord", this.get("c_data"),true);

    $("#calendar").on("click", ".pull-title a", function () {
      $(this).parent().next().toggleClass("active");
      $(this).toggleClass("icon-xsdjiantou2")
    })
    //获取经营情况统计
    this.send("getStatistics");

  },
  actions: {

    clickCalendar(e){
      let dom = $(e.target);
      this.send("getData", dom);
      if(this.get("c_data").year==this.get("today").year&&this.get("c_data").month==this.get("today").month&&this.get("c_data").day==this.get("today").day){
        this.set("isToday",false);
      }else{
        this.set("isToday",true);
      }
      this.send("getRecord", this.get("c_data"));

    },
    //点击 所有逾期未处理 区块
    clickStats(mark,e){
      let params = {
        "year":this.get("today").year,
        "month":this.get("today").month,
        "day":this.get("today").day,
        "is_today":true,
        "mark":mark,
        "view":this.get("contentView"),
      };
      this.send("addSty",e);
      this.send("getContent", params);
     },
    //点击 应收账单 区块
    clickContentTab(view){
      let params = this.get("contentParams");
      params['view'] = view;
      this.send("getContent", params);
    },
    // 点击改变后的样式
    addSty(e){
      if(e){
        let dom=$(e.target).parent().parent();
        let col=dom.children("a:hover").find("i").css("color");
        dom.children("a").find("b").css({
          "fontSize":"16px"
        });
        dom.children("a").find("i").css({
          "fontSize":"22px",
          "color":col
        });
        dom.siblings().find("b").css({
          "fontSize":"14px"
        });
        dom.siblings().find("i").css({
          "fontSize":"18px",
          "color":""
        });

      }
    },
    //获取首页统计数据
    getStatistics(){
      let _this = this;
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl1 + "statistics";
      ajax(url, {
        method: 'Get'
      }).then((res) => {
        _this.set("statistics",res);
      }).catch((err)=> {
        // $.toastr.error("获取统计数据失败!")
      });
    },
    getRecord(data,all=false) {

      let _this = this;
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl1 + "todos/calendar";
      ajax(url, {
        method: 'Get',
        data: data

      }).then((res) => {
        _this.set("calendar", res);

        let args = {
          "year": res.theday.year,
          "month": res.theday.month,
          "day": res.theday.day,
          "mark": "",
        };

        if (_this.get("flag")) {
          _this.set("today", {
            "year": res.theday.year,
            "month": res.theday.month,
            "day": res.theday.day
          });
          _this.set("flag", false);
        }
        if(all){
          _this.send("clickStats", 'over');
        }else{
          _this.send("getContent", args);
        }
      }).catch((err)=> {
        $.toastr.error("获取日历数据失败!")
      });
    },

    getData(dom){

      let year = dom.attr("data-year");
      let month = dom.attr("data-month");
      let day = dom.attr("data-day");
      let data = {
        year: year,
        month: month,
        day: day,
        is_today: false
      };
      this.set("c_data", data);
    },

    getContent(data){
      let _this = this;
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl1 + "content";
      data['view'] = this.get("contentParams")['view'];
      this.set("contentParams",data);
      //loading
      this.set("loading",true);
      this.set("content_list","");
      ajax(url, {
        method: 'Get',
        data: data
      }).then((res) => {
        this.set("contentStats",res.meta);
        this.set("content_list",res.data);
        if(res.data.length<=0){
          this.set("content_list","");
        }
        //loading
        this.set("loading",false);
      }).catch((err)=> {
        this.set("content_list","");
        $.toastr.error("获取概况详情数据失败!")
      });

    },


    reminderDetail(id){

      $("#reminder-trigger").trigger("click");
      let _this = this;
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl1 + "reminders/" + id;
      ajax(url, {
        method: 'Get'

      }).then((res) => {
        res.data.attributes.from = 1;
        res.data.attributes.id = res.data.id;
        _this.set("rDetail", res.data.attributes);

      }).catch((err)=> {

        $.toastr.error("获取备忘详情数据失败!")
      });
    },


    clearReminder(){
      this.set("rDetail", {});
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

    confirmRent2({id,is_meter_need,has_read_meter},type,e){
      if(!has_read_meter&&is_meter_need){
        e.preventDefault();
        e.stopPropagation();
        $.toastr.error('你还有未完成的抄表项<br/>请先完成抄表项.')
        return;
      }
      this.send('confirmRent',id,type,e);
    },

    //确认账单
    confirmRent(id,type,e){
      $("#confirmRent-trigger").trigger("click");
      if(type=='house'){
        this.send("getHouseOrder", id);
      }else{
        this.send("getRoomOrder", id);
      }
      e.stopPropagation();
    },

    getRoomOrder(id){

      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl + "roomorders/" + id;
      ajax(url, {
        method: 'Get'
      }).then((res) => {
        this.set("bill", res.data);
      }).catch((err)=> {
        $.toastr.error("获取租客账单失败!");
      });

    },

    getHouseOrder(id){
      let _this=this;
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl + "houseorders/"+id;
      ajax(url, {
        method: 'Get'
      }).then((res) => {
          _this.set("bill", res.data);
      }).catch((err)=> {
        $.toastr.error("获取业主账单失败!");
      });
    },

    cancelHouseContract(id, e){

      let _this = this;
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl + "housecontracts/" + id;
      ajax(url, {
        method: 'Get'
      }).then((res) => {

        _this.set("contract", res.data.attributes);
        let un_confirm = res.data.attributes.un_confirm_order_num;
        this.send('refresh','refreshCancel');
        if(un_confirm>0){
          this.set("optionData",{num:res.data.attributes.un_confirm_order_num});
          $("#back_rent").trigger("click");
        }else {
          $("#cancelContract_btn").trigger("click");
        }

      }).catch((err)=> {

      });
      e.stopPropagation();
    },

    cancelRoomContract(id,e){

      let _this = this;
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl + "roomcontracts/" + id;
      ajax(url, {
        method: 'Get'
      }).then((res) => {

        _this.set("contract", res.data.attributes);
        let un_confirm = res.data.attributes.un_confirm_order_num;
        this.send('refresh','refreshCancel');
        if(un_confirm>0){
          this.set("optionData",{num:res.data.attributes.un_confirm_order_num});
          $("#back_rent").trigger("click");
        }else {
          $("#cancelContract_btn").trigger("click");
        }

      }).catch((err)=> {

      });

      e.stopPropagation();
    },

    getHouse(id,invoke){
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl1 + "houseinfos/" + id;
      ajax(url, {
        method: 'Get',
        async: false,
      }).then((res) => {
        this.set("house", res.data.attributes);
        if(typeof invoke === 'function'){
          invoke(res.data.attributes.contract);
        }
      }).catch((err)=> {

      });
    },

    renewHouse(id,e){
      this.send("getHouse", id,(contract)=>{
        if(contract.can_renew){
          this.send('refresh','refreshHouse');
          this.$("#rentalhouse_btn").click();
        }else{
          $.toastr.error("您有未处理完账单,暂时无法续租!");
        }
      });
      if(e){
        e.preventDefault();
        e.stopPropagation();
      }
    },

    editHouse(id){
      this.send("getHouse", id,(contract)=>{
        this.send('refresh','refreshHouse');
        this.$('.trigger-contract-owner-edit').eq(0).click();
      });
    },

    refreshRoom(){
      let contract = this.get('contract');
      this.send('getRoomContract',contract.id);
    },

    refreshHouse(){
      let contract = this.get('contract');
      this.send('getHouseContract',contract.id);
    },


    noRenew(e){

      $.toastr.error("您有未处理完账单,暂时无法续租");
      e.stopPropagation();
    },

    refresh(type){
      this.set(type, false);
      Ember.run.next( () => {
        this.set(type, true);
      });
    },

    getRoom(id,invoke){
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl1 + "roominfos/" + id;
      ajax(url, {
        method: 'Get',
        async: false,
      }).then((res) => {
        this.set("room", res.data.attributes);
        if(typeof invoke==='function'){
          invoke(res.data.attributes.contract);
        }
      }).catch((err)=> {

      });
    },

    renewRoom(id,e){
      this.send("getRoom", id,(contract)=>{
        if(contract.can_renew){
          this.send('refresh','refreshRoom');
          this.$("#rentalRoom_btn").click();
        }else{
          $.toastr.error("您有未处理完账单,暂时无法续租!");
        }
      });
      if(e){
        e.preventDefault();
        e.stopPropagation();
      }
    },

    editRoom(id){
      this.send("getRoom", id,(contract)=>{
        this.send('refresh','refreshRoom');
        this.$('.trigger-contract-customer-edit').eq(0).click();
      });
    },


    packUpCalendar(flag, e){

      if (flag) {
        $(e.target).addClass("xsd-none");
        $(e.target).next().removeClass("xsd-none");
        $("#calendar .list").css("height", $("body").height() - 176 + "px")
      } else {
        $(e.target).addClass("xsd-none")
        $(e.target).prev().removeClass("xsd-none")

        $("#calendar .list").css("height", $("body").height() - 462 + "px")
      }
      if (!$(".pickUp").is(":animated")) {
        $(e.target).parent().parent().next().find(".pickUp").slideToggle();
      }

    },
    updateStatus(){
      this.send('getContent',this.get("contentParams"));
    },

    /*
     在弹窗中编辑账单后，在这里更新指定账单
     @param entityId {Number} roomId或者houseId
     */
    updateOrder(entityId,type,id){
      if(type=='room'){
        this.send('getRoomOrder',id);
      }else{
        this.send('getHouseOrder',id);
      }
    },

    //去编辑业主账单，这里可以复用之前的数据 this.get('bill')
    editOwnerBill(id){
      this.send('refresh','refreshBill');
      $('#editBill_btn').click();
    },

    //去编辑租客账单，这里可以复用之前的数据 this.get('bill')
    editCustomerBill(id){
      this.send('refresh','refreshBill');
      $('#editBill_btn').click();
    }

  }


});

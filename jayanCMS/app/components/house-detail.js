import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Component.extend({
  monthsY: [0, 1, 2, 3],
  monthsF: [{num: 1, text: "月付"},
    {num: 2, text: "2月付"}, {num: 3, text: "季付"},
    {num: 4, text: "4月付"}, {num: 5, text: "5月付"},
    {num: 6, text: "半年付"}, {num: 7, text: "7月付"},
    {num: 8, text: "8月付"}, {num: 9, text: "9月付"},
    {num: 10, text: "10月付"}, {num: 11, text: "11月付"}, {num: 12, text: "年付"}],
  editHouse: false,
  editInfo: true,
  editAll: true,
  bill: "",
  order_detail: false,
  orderDetail: "",
  laterDetail: true,
  isPart: false,
  payType: "收入",
  districts: [],
  blocks: [],
  didInsertElement: function () {
    let _this = this;
    $("#houseDetail").on("click", ".xsd-modal-close", function () {
      clearStatus()
    });
    $("#xsd-mask").click(function () {
      clearStatus()
    });

    function clearStatus() {
      _this.set("order_detail", false);
      _this.set("orderDetail", "");
      _this.set("isDrawer", false);
      _this.set("editAll", true);
      _this.set("editHouse", false);
      _this.set("editInfo", true);
      _this.set("house", null);
      if (_this.get("signalData")) {
        _this.sendAction("modelReload");
        _this.set("signalData", null);
      }
    }
  },

  actions: {
    printBill(){
      window.print();
    },
    cloneContract(){
      let frag = this.$('#tab-2 .list-info').clone();
      $("#printContract-con").html(frag);
    },
    printContract(){
      window.print();
    },

    addBill(){
      this.sendAction('addBill');
    },

    editBill(id){
      this.sendAction('editBill',id);
    },

    resetCon(){
      $("#printContract-con").html("");

    },

    roomNotes(){
      if($("#roomNoteEdit").val()=="房源备注（100字以内）"){
        $("#roomNoteEdit").val("");
      }
    },

    wordLimit(){
      let value=$("#roomNoteEdit").val();
      if(value.length>100){
        $("#roomNoteEdit").val(value.substring(0,100));
        $.toastr.error("房源备注（100字以内）");
      }
    },

    partSwitch(e){

      if (!$(e.target).hasClass("xsd-open")) {
        if (this.get('flag')) {
          $.toastr.error("分段合同不支持租客分期!");
          return false;
        }
        let date1 = this.$("#update_contract_start_time").val();
        let date2 = this.$("#update_contract_end_time").val();
        if (date1 == "" || date2 == "") {
          $.toastr.error("请先完善合同起始时间")
          return false;
        } else {
          this.set("first_part_time", date1)
          this.set("part", true);
        }
      } else {
        $("#newPartList .part").remove();
        this.set("part", false);
      }
      $(e.target).toggleClass("xsd-open")
    },

    addPart(e){

      let index = this.$("#partList .part").length;
      let end = this.$("#update_contract_end_time").val();
      let endTime = this.$($("input[name='house_partEndTime']")[index - 1]).val();
      let money = this.$($("input[name='house_month_rental']")[index - 1]).val();
      if (endTime == "" || money == "") {
        $.toastr.error("请先完善上个分段");
        return false;
      } else if (endTime == end) {
        $.toastr.error("已达分段的结束时间");
        return false;
      }
      let num = this.$("#newPartList .part").length + 2;
      let str = '<div class="part xsd-margin-b12" id="datepickerHouse' + num + '"' + '><p class="xsd-margin-b6">分段' + num + '</p>'
        + '<div class="xsd-clearfix">'
        + '<input class="xsd-pull-left xsd-input xsd-margin-r12" name="house_partStartTime" type="text" placeholder="输入分段开始时间" readonly="readonly" value=' + moment(endTime).add(1, "days").format('YYYY-MM-DD') + '>'
        + '<label class="xsd-pull-left  xsd-margin-r12">'
        + '<div class="xsd-input-group">'
        + '<i class="iconfont">&#xe63e;</i>'
        + '<input type="text" class="xsd-input datepicker" name="house_partEndTime" placeholder="输入分段结束时间" title="分段结束时间" validate="required"  readonly="readonly"/>'
        + '</div>'
        + '</label>'
        + '<label class="xsd-pull-left">'
        + '<div class="xsd-input-group">'
        + '<i class="iconfont">元/月</i>'
        + '<input class="xsd-input" type="text" placeholder="输入分段租金" validate="required|numeric" title="租金金额" name="house_month_rental">'
        + '</div>'
        + '</label>'
        + '</div></div>';
      this.$("#newPartList").append(str);
      this.send("picker", num)
    },

    picker(num){

      let end = this.$("input[name='endTime']").val();
      let picker = new Pikaday({
        field: $('#datepickerHouse' + num + " input[name='house_partEndTime']")[0],
        minDate: new Date($('#datepickerHouse' + num + " input[name='house_partStartTime']").val()),
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

    deleteContract(id, infoId){

      let args = {};
      args.id = id;
      args.type = "house";
      args.infoId = infoId;
      this.set("optionData", args);
      this.set('contractDetail',false);
    },

    houseStop(id, is_stop){

      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get('config').apiUrl;
      ajax(url + 'houses/' + id, {
        method: 'PATCH',
        data: {
          is_stop: is_stop,
        }
      }).then((res) => {

        if (is_stop) {
          $("#stopHouse .xsd-modal-close").trigger("click");
          $.toastr.success("停用房源成功!");
        } else {
          $.toastr.success("房源启用成功!");
        }
        this.sendAction("updateStatus", id, 'house');
      }).catch((err) => {
        $.toastr.error(err.jqXHR.responseJSON.errors.detail);
      });
    },

    deleteHouse(id){

      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get('config').apiUrl;
      ajax(url + 'houses/' + id, {
        method: 'delete'
      }).then((res) => {
        $.toastr.success("删除房源成功！");
        $("#delHouse .xsd-modal-close").trigger("click");
        this.sendAction("houseReload");
        $("#houseDetail .xsd-modal-close").trigger("click");

      }).catch((err) => {

        $.toastr.error(err.jqXHR.responseJSON.errors.detail);
      });

    },

    edit(type, flag){

      if (type == "house") {
        this.set("editHouse", true);
        this.set("editInfo", false);
        if (this.get("districts").length == 0) {
          let _this = this;
          $.getJSON(_this.get("config").apiUrl + 'city/search?callback=?', {
            level: 2,
            city: $("#edit_city").val()
          }, function (data) {
            _this.set('districts', data['results']);
          });
          $.getJSON(_this.get("config").apiUrl + 'city/search?callback=?', {
            level: 3,
            city: $("#edit_city").val(),
            district: $("#update_district").val()
          }, function (data) {
            _this.set('blocks', data['results']);
          });
        }

      } else if (type = "contract") {
        this.sendAction('editContract');
      }

    },

    renew(renewable,e){
      if(!renewable){
        $.toastr.error("您有未处理完账单,暂时无法续租");
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      this.sendAction('renewContract');
    },

    saveHouse(id){
      if ($('#houseDetail #tab-1').validate() !== true) {
        return;
      }
      let _this = this;
      let is_decorating = false;
      if (this.$("#switchBtn").hasClass("xsd-open")) {
        is_decorating = true;
      }
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get('config').apiUrl;
      let is_whole = "";
      if($("#edit_iswhole").val()=="合租"){
        is_whole=false;
      }else{
        is_whole=true;
      }
      ajax(url + 'houses/' + id, {
        method: 'patch',
        data: {
          "area": $("#edit_area").val(),
          "location": $("#edit_location").val(),
          "city": $("#edit_city").val(),
          "district": $("#update_district").val(),
          "block": $("#edit_block").val(),
          "address": $("#edit_address").val(),
          "remark":$("#roomNoteEdit").val(),
          "is_decorating": is_decorating,
          "decorating_start_at": _this.$("#d_house_startTime").val(),
          "decorating_end_at": _this.$("#d_house_endTime").val(),
          "is_whole":is_whole,
        }
      }).then((res) => {
        $.toastr.success("房源修改成功！");
        _this.sendAction("updateStatus", id, 'house');
        _this.set("editHouse", false);
        _this.set("editInfo", true);
      }).catch((xhr, err) => {
        if (xhr.jqXHR.responseJSON.errors.detail) {
          $.toastr.error(xhr.jqXHR.responseJSON.errors.detail);
        } else {
          $.toastr.error("装修时间必须填写!")
        }

      });
    },

    saveHouseContract(id, houseId){
      if ($('#update_contract').validate() !== true) {
        return;
      }
      let start_time = this.$("#update_contract_start_time").val();
      let end_time = this.$("#update_contract_end_time").val();
      let month_rental = this.$("#update_contract_month_rental").val();
      if (this.$("#partContract").hasClass("xsd-open")) {
        let len = this.$("#partList .part").length;
        if (this.$($("#partList input[name='house_partEndTime']")[len - 1]).val() != end_time) {
          $.toastr.error("分段合同结束时间必须等于合同结束时间！");
          return;
        }
        start_time = "";
        end_time = "";
        month_rental = "";
        for (var i = 0; i < len; i++) {
          if (start_time == "") {
            start_time = this.$($("#partList input[name='house_partStartTime']")[i]).val();
            end_time = this.$($("#partList input[name='house_partEndTime']")[i]).val();
            month_rental = this.$($("#partList input[name='house_month_rental']")[i]).val();
          } else {
            start_time = start_time + "," + this.$($("#partList input[name='house_partStartTime']")[i]).val();
            end_time = end_time + "," + this.$($("#partList input[name='house_partEndTime']")[i]).val();
            month_rental = month_rental + "," + this.$($("#partList input[name='house_month_rental']")[i]).val();
          }

        }
      }
      let _this = this;
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get('config').apiUrl;
      ajax(url + 'housecontracts/' + id, {
        method: 'patch',
        data: {
          "owner_name": _this.$("#d_owner_name").val(),
          "owner_phone": _this.$("#d_owner_phone").val(),
          "owner_id_number": _this.$("#d_owner_id_number").val(),
          "owner_id_pictures": _this.$("#d_owner_id_pictures").val(),
          "pictures": _this.$("#d_contract_pictures").val(),
          "comments": _this.$("#house_comments").val(),
          "start_time": start_time,
          "end_time": end_time,
          "month_rental": month_rental,
          "deposit": _this.$("#update_contract_deposit").val(),
          "advanced_days": _this.$("#update_house_contract_advanced_days").val(),
          "rent_pay_way": _this.$("#update_house_rent_pay_way").attr("data-value"),
          "fixed_pay_date": _this.$("#update_house_contract_fixed_date").val(),
          "pay_method_y": _this.$("#update_contract_pay_method_y").attr("data-value"),
          "pay_method_f": _this.$("#update_contract_pay_method_f").attr("data-value"),
          "water_fees": _this.$("#update_contract_water_fees").val(),
          "power_fees": _this.$("#update_contract_power_fees").val(),
          "gas_fees": _this.$("#update_contract_gas_fees").val(),
          "property_fees": _this.$("#update_contract_property_fees").val(),
          "service_fees": _this.$("#update_contract_service_fees").val(),
          "cleaning_fees": _this.$("#update_contract_cleaning_fees").val(),
          "upkeep_fees": _this.$("#update_contract_upkeep_fees").val(),
          "material_fees": _this.$("#update_contract_material_fees").val(),
          "catv_fees": _this.$("#update_contract_catv_fees").val(),
          "internet_fees": _this.$("#update_contract_internet_fees").val(),
          "sanitation_fees": _this.$("#update_contract_sanitation_fees").val(),
          "free_fees": _this.$("#update_contract_free_fees").val(),
          "other_fees": _this.$("#update_contract_other_fees").val()
        }
      }).then((res) => {
        $.toastr.success("修改成功！");
        _this.set("editContract", true);
        _this.sendAction("updateStatus", houseId, 'house');
      }).catch((xhr, err) => {
        $.toastr.error("修改失败！");
      });
    },

    switch(id){
      $(id).toggleClass("xsd-open");
      this.$("#d_time").toggle();
    },

    confirmRent(id){
      $("#confirmRent-trigger").trigger("click");
      this.send("getOrder", id, "");
    },

    cancel(id, flag, e){
      this.sendAction("getContract", id, flag, e)
    },


    lookOrder(id, type, infoId, flag){
      if (type == "houseorders") {
        let args = {};
        args.id = id;
        args.type = type;
        args.infoId = infoId;
        args.flag = flag;
        this.set("optionData", args);
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

    getHouseContract(id){
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get('config').apiUrl;
      ajax(url + 'housecontracts/' + id, {
        method: 'get',
      }).then((res) => {
        this.set("contractDetail",true);
        this.set("historyContract",res.data.attributes);
      }).catch((xhr, err) => {
        $.toastr.error("获取合同信息失败！");
      });
    },

    getOrder(id, type, checkAble){

      let _this = this;
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl + "houseorders/" + id;
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

    switch_pay_way(flag){
      this.set("house.contract.rent_pay_way", flag);
    },

    chooseCity(city){

      let _this = this;
      _this.$("#update_district").val("");
      _this.$("#edit_block").val("");
      $.getJSON(_this.get("config").apiUrl + 'city/search?callback=?', {level: 2, city: city}, function (data) {
        _this.set('districts', data['results']);
      });

    },

    chooseDistrict(district) {
      let _this = this;
      let city = $("#edit_city").val();
      let postData = {
        level: 3,
        city: city,
        district: district
      }
      $.getJSON(_this.get("config").apiUrl + 'city/search?callback=?', postData, function (data) {
        _this.set('blocks', data['results']);
      });
    },

    createContract(){
      this.sendAction('refresher','refreshHouse');
    }


  }


});

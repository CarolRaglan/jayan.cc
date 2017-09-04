import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Component.extend({

  flag: false,
  didInsertElement: function () {
    let _this = this;
    $("#add-new input[name='public']").click(function () {

      if ($("#gongKe").is(":checked")) {
        _this.set("flag", false);
      } else {
        _this.set("flag", true);
      }
    })
  },


  actions: {

    addNew(type, id){

      let minValue=$("#min_rent").val();
      let maxValue=$("#max_rent").val();
      let reg = /^\+?[1-9]\d*$/;
      if(minValue!="") {
        if (!reg.test(minValue)) {
          $.toastr.error("请输入有效的租金最低金额!");
          return;
        }
      }
      if(maxValue!="") {
        if (!reg.test(maxValue)) {
          $.toastr.error("请输入有效的租金最高金额!");
          return;
        }
      }

      if(minValue!=""&&maxValue!="") {
        if (Number(minValue) > Number(maxValue)) {
          $.toastr.error("请输入有效的最低、最高金额!");
          return;
        }
      }


      if ($('#add-newPeople').validate() !== true) {
        return;
      }

      let _this = this;
      this.get('auth').registerTokenToAjaxHeader();

      let method = "Post";
      let url = this.get("config").apiUrl + "customers";
      if (type == "edit") {
        method = "Patch";
        url = this.get("config").apiUrl + "customers/" + id;
      }

      let data = {
        "name": $("#people_name").val(), /*租客姓名*/
        "sex": $("#people_sex").attr("data-value"), /*租客性别*/
        "phone": $("#people_phone").val(), /*联系方式*/
        "source": $("#people_source").attr("data-value"), /*租客来源*/
        "urgency": $("#people_urgency").attr("data-value"), /*紧急程度*/
        "wanted_day": $("#people_at__gte").val(), /*入住时间*/
        "address": $("#people_address").val(), /*地段需求*/
        "book_time":$("#book_day").val() + " " + $("#book_time").val(), /*预约日期*/
        "length": $("#rental_time").val(), /*租期*/
        "min_rent": $("#min_rent").val(), /*最低金额*/
        "max_rent": $("#max_rent").val(), /*最高金额*/
        "headcount": $("#people_num").val(), /*人数*/
        "house_type": $("input:radio[name='room']:checked").parent().text(), /*户型需求*/
        "customer_type": $("input:radio[name='public']:checked").parent().attr("data-value"), /*新客分配*/
        "operator": $("#allocate").attr("data-value"), /*私客分配时的选项*/
        "comments": $("#comments").val(), /*合同备注*/
      };

      ajax(url, {

        method: method,
        data: data
      }).then((res) => {
        if (type == "edit") {
          $.toastr.success("修改成功!");
          this.sendAction("detail",id);
        } else {
         $.toastr.success("添加成功!");
          this.sendAction("refreshModel");
        }
        $('#add-new .xsd-modal-header .xsd-modal-close').trigger("click");


      }).catch((err)=> {

        $.toastr.error(err.jqXHR.responseJSON.errors.detail);

      });
    }

  }


});

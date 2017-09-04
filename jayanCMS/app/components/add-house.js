import Ember from 'ember';
import ajax from 'ic-ajax';
import validate from '../utils/validate';

export default Ember.Component.extend({

  city:"",
  lists:"",
  districts:"",
  blocks:"",
  district:"",
  block:"",
  type:true,

  didInsertElement:function () {

    let _this=this;
    _this.$("#addHouse").on("click",".rentType input",function () {

       if($("#partRent input:checked").length==1){

         _this.set("type",false);
       } else{

         _this.set("type",true);
       }

    });

    _this.$("#addHouse").on("click",".xsd-modal-close",function () {

      if(_this.get("flag")){
        _this.set("type",true);
      }

    });

    let province  = this.get("auth").user.province,
        cityArrId = $(".province-list li:contains('"+ province +"')")[0].value;
    this.set('city', this.get("auth").cityArr[cityArrId]);

    $.getJSON(_this.get("config").apiUrl+'city/search?callback=?', { level: 2, city: this.get("auth").user.city }, function (data) {
      _this.set('districts', data['results']);
    });
  },

  actions:{

    search(e){

      let city = $("#cityName").val();
      let keyword = $(e.target).val();
      let _this = this;
      $.getJSON(_this.get("config").apiUrl+'area/search?callback=?',
          {city:city , name:keyword},
          function(data){

            _this.set("lists",data.results);
            _this.$(".area_list").show();
          });
    },

    chooseCity(e){
      let _this=this;
      _this.$("#areaName").val("");
      _this.$("#areaAddress").val("");
      $.getJSON(_this.get("config").apiUrl+'city/search?callback=?', { level: 2, city: $(e.target).text() }, function (data) {
        _this.set('districts', data['results']);
      });
    },

    chooseDistrict(e) {

      let _this = this;
      let city=$("#cityName").val();
      let district=$(e.target).text();
      let postData = {
        level: 3,
        city: city,
        district: district
      }
      $.getJSON(_this.get("config").apiUrl+'city/search?callback=?', postData, function (data) {
        _this.set('blocks', data['results']);
      });
      $("#add_district").val(district);
      this.set("district",district);
      $(e.target).parent().hide();
      return false;
    },

    selectResult(name,address,district,block){

         let _this=this;
         $("#areaName").val(name);
         $("#areaAddress").val(address);
         this.set("district",district);
         this.set("block",block);
         this.$(".area_list").hide();

    },

    selectBlock(e){

      let block=$(e.target).text();
      $("#add_block").val(block);
      this.set("block",block)
      $(e.target).parent().hide();
      return false;


    },

    provinceSelected(e){
      let selectedPro = e.target.value;
      //隐藏选项框
      $(e.target).parent().hide();
      $('#province').val(selectedPro);
      $('#cityName').val("");
      $('#add_block').val("");
      $('#edit_district').val("");
      //改变城市选项
      this.set('city',this.get("auth").cityArr[selectedPro]);
    },

    addHouse(){

      if($('#public-form').validate()!==true){
        return;
      }
       let is_decorating=false;
       let is_whole=true;
       if(this.$("#d_house").hasClass("xsd-open")){
           is_decorating=true;
       }
       if(this.$("#partRent input:checked").length==1){
         is_whole=false;
       }
       let data={
          is_whole:is_whole,
         province: $("#provinceName").val(),
          city:this.$("#cityName").val(),
          area:this.$("#areaName").val(),
          address:this.$("#areaAddress").val(),
          district:this.get("district"),
         block:this.get("block"),
         building_num:this.$("#building_num").val(),
         unit_num:this.$("#unit_num").val(),
         floor_num:this.$("#floor_num").val(),
         house_num:this.$("#house_num").val(),
         is_decorating:is_decorating,
         decorating_start_at:this.$("#d_startTime").val(),
         decorating_end_at:this.$("#d_endTime").val(),
         room_num:this.$("#room_num").val(),

       }

      let _this=this;
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl + "houses";
      ajax(url, {
        method: 'Post',
        data:data
      }).then((res) => {
        $.toastr.success("创建成功!");
        _this.$("#addHouse .xsd-modal-close").trigger("click");
        _this.set("lists",null);
        _this.sendAction("houseReload");
      }).catch((err)=> {
        $.toastr.error(validate(err));
      });

    },

    switch(e){

      $(e.target).toggleClass("xsd-open")
        this.$("#d_time").toggle();
    },
  }
});

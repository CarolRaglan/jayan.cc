import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Component.extend({

  didInsertElement: function () {

    let _this=this;

    $("#release-room").on("click", "#room_deploy a", function (e) {

      if (!_this.editUnAble) {

        let dom = $(e.target);
        let target = dom.attr("event-type");
        if (target === "all") {
          if (dom.hasClass("select")) {
            dom.removeClass("select");
            dom.next().find("a").removeClass("select")

          } else {
            dom.addClass("select");
            dom.next().find("a").addClass("select")

          }

        } else {

          if (dom.hasClass("select")) {

            dom.removeClass("select");
            if (dom.parent().prev().hasClass("select")) {
              dom.parent().prev().removeClass("select");
            }

          } else {

            dom.addClass("select");
          }
        };
      }

    })
    $("#release-room").on("click", ".photos li img",function () {

      $(this).parents(".imgCover").removeClass("imgCover");
      $(this).parents("ul").find("li").removeClass("active");
      $(this).parent().addClass("active");

    })

  },
  actions: {

    publicHouse(id, openType){

      if ($('#release-room').validate() !== true) {
        return;
      } else {
        if ($("#roomPictures").val().split(",").length < 5) {
          $.toastr.error("房间照片不能少于5张!");
          return;
        }
      }
      let type = 'Post';
      let url = this.get("config").apiUrl1 + "openchannels/showrooms?channel=" + this.get("channel");
      if (openType == 'edit') {

        type = 'Put';
        url = this.get("config").apiUrl1 + "openchannels/showrooms/" + id + "?channel=" + this.get("channel");
      }
      this.get('auth').registerTokenToAjaxHeader();
      let _params = {};
      _params.room_id = id;
      //解决封面问题
      let num = $("#release-room .photos .active").index();
      let img_id = $("#release-room .photos .active img").attr("data-id");
      if (num != 0 && num != -1) {
        $("#roomPictures").val((img_id + ",") + $("#roomPictures").val().replace((img_id + ","), ""));
      }
      _params.channel = this.get("channel");
      _params.bedrooms = $("#publish_room").val();
      _params.area=$("#publish_areaWhere").val();
      _params.livingrooms = $("#publish_office").val();
      _params.washrooms = $("#publish_toilet").val();
      _params.space = $("#publish_rentalArea").val();
      _params.room_type = $("#publish_roomType").attr("data-value");
      _params.toward = $("#publish_toward").attr("data-value");
      _params.total_floor_num = $("#publish_totalFloor").val();
      _params.floor_num = $("#publish_whereFloor").val();
      // if (this.get("channel") == 0){
      _params.tags = getTags($("#tags .list .select"));
      _params.room_assets = getTags($("#room_assets .list .select"));
      _params.support_services = getTags($("#public_assets .list .select"));
      _params.publish_phone = $("#publish_phone").val();
      _params.publish_name = $("#publish_name").val();
      _params.can_rent_date = $("#publish_dateHire").val();
      if(_params.room_assets==""){
          $.toastr.error("房间配置不能为空!");
          return;
      }
      // }else if(this.get("channel") == 1||this.get("channel") == 2){
      //   _params.tags = "";
      //   _params.room_assets= "";
      //   _params.public_assets="";
        // _params.publish_phone=$("#publish_phone").val();
        // _params.publish_name=this.get("room").publish_name;
        // _params.can_rent_date = "1949-10-01";
        _params.pay_method = $("#pay_method").val();
        // _params.public_equipment = getTags($("#public_equipment .list .select"));
        // _params.room_equipment = getTags($("#room_equipment .list .select"));
        // _params.people_love = getTags($("#people_love .list .select"));
        _params.decoration = $("#publish_decoration").val();
        // if(_params.public_equipment==""||_params.room_equipment==""){
        //   $.toastr.error("公用或独用配置不能为空!");
        //   return;
        // }
      // }
      _params.price = $("#publish_rentAmount").val();
      _params.room_desc = $("#room_desc").val();
      if(500<_params.room_desc.length||_params.room_desc.length<50){
        $.toastr.error("房源描述必须在50-500字");
        return;
      }
      _params.pictures = $("#roomPictures").val();
      ajax(url, {
        method: type,
        data: _params,
      }).then((res) => {
        if (openType == 'edit') {

          $.toastr.success("修改成功!");
        } else {
          $.toastr.success("发布成功!");
        }
        $("#release-room .xsd-modal-close").trigger('click');
        this.sendAction("roomReload");
      }).catch((err)=> {
        $.toastr.error(err.jqXHR.responseJSON.error);
      });

      function getTags(doms) {

        let str = '';
        if (doms.length != 0) {

          $.each(doms, function (i, value) {
            if (i == 0) {
              str = $(value).attr("data-value")

            } else {
              str = str + "," + $(value).attr("data-value")
            }

          })
        }

        return str;

      }
    },
    goAuth(){
      $("#release-room .xsd-modal-header .xsd-modal-close").trigger("click");
      $("#go_auth").trigger("click");
    }


  }

});

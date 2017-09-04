import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Controller.extend({
  type: "rent",
  tips: 'spread',
  queryParams: ['keyword', 'city', 'district', 'block', 'area', 'house_num', 'is_whole','channel','status', 'page', 'perPage'],
  page: 1,
  perPage: 20,
  refresh: true,
  editUnAble: false,
  isChecked:true,
  navFlag:false,
  openType: "",
  flag:false,
  actions: {

    tabs(type){

      this.get("router").transitionTo({
        queryParams: {
          status: type,
          page: 1,
        }
      })

    },
    isChecked(){
      this.set("isChecked",$("#sendHouseAgr").is(":checked"));
    },
    goAuth(){
      $("#release-room .xsd-modal-header .xsd-modal-close").trigger("click");
      $("#go_auth").trigger("click");
    },
    switch(type,num){
      $("#"+type).trigger("click");
      if(type == 'publish' ){
        this.set("navFlag",true)
      }else{
        this.set("navFlag",false)
      }
       this.get("router").transitionTo({
         queryParams: {
          city:'',
          district:'',
          block:'',
          area:'',
          is_whole:'',
          keyword:'',
          house_num:'',
         channel:'',
         status:num,
         page:1,


         }
       });
      $("#citySearch").val("");
      $("#district").val("");
      $("#block").val("");
      $("#area").val("");
      $("#filter1").val("");
      $("#s_house_type").val("");
      $("#search").val("");
      $("#house_id").val("");

    },
    detail(id, type,channel){

      this.set("openType", type);
      if (type != 'check') {

        this.set("editUnAble", false);
      } else {

        this.set("editUnAble", true);
      }
      let _this = this;
      _this.set("refresh", false);
      Ember.run.next(function () {
        _this.set("refresh", true);

      });
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl1 + "openchannels/showrooms/" + id+"?channel="+channel;
      ajax(url, {
        method: 'Get',
        async: false,
      }).then((res) => {
        _this.set("detail", res);
      }).catch((err)=> {
        $.toastr.error("服务器出错!");
      });
    },

    goPublish(type){

      this.set("flag", true);
      this.get("router").transitionTo({
        queryParams: {
          channel:'',
          status:0,
          page:1
        }
      })
    },

    backIndex(){

      this.set("flag", false);
    },

    roomReload(){

      this.send('reloadModel');
    }

  }

});

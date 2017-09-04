import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Component.extend({
  version: "",
  versionNum: "",
  didInsertElement: function () {
    this.send("getVersion");
  },
  actions: {

    getVersion(){

      let pcl="https:" == document.location.protocol ? 'https://' : 'http://'
      let url = pcl + window.location.host + "/version.json"
      ajax(url, {
        method: "Get",
        async: false,
        cache:false,
      }).then((data)=> {

        this.set("version", data.data[0]);
        this.send("reloadFromStoreage");
        let str = this.get("versionNum");
        if (str == null || data.data[0].version * 100 > str * 100) {
          if($.cookie("message")){
            $("#newVersion_btn").trigger("click");
          }else{
            if(!this.get("auth").user.is_first_login){
              $("#newVersion_btn").trigger("click");
            }
          }

        }
      })
    },

    persistVersion(version){

      $.cookie('versionNum', JSON.stringify(version),{ expires: 365,path:'/'});
      $("#updateVersion").text("v" + version);
      // $("#switch_a").trigger("click");
    },

    reloadFromStoreage() {

      if($.cookie('versionNum')){

        this.set('versionNum', JSON.parse($.cookie('versionNum')));
      }else{

        this.set('versionNum', null);
      }


    },

  }
});

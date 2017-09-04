import Ember from 'ember';

export default Ember.Component.extend({
  message: "",
  versionNum: "",

  didInsertElement: function () {

    this.send("checkLook");
  },

  actions: {

    checkLook(){

        this.send("isLook");
        let str = this.get("message");
        if (str !="fangjia"&&!this.get("auth").user.is_first_login) {
          $("#push_dialog").trigger("click")
        }
    },

    persistLook(message,flag){
      
      $.cookie('message', message, { expires: 365,path:'/'});
      if(flag){
        //$("#separate-management_a a").trigger("click");
        window.open("http://www.shuidiguanjia.com/index.php/article/index/id/118.html")
      }
    },
    
    isLook() {

      if($.cookie('message')){

        this.set('message', $.cookie('message'));
      }else{

        this.set('message', null);
      }
      
    }
    
  }

});

import Ember from 'ember';

export default Ember.Controller.extend({
  version:"3.0",
  init(){
    //登录初始化高度
    $("#login-reg").parent().css({"height":"100%" ,"overflow":"hidden"});

    let _this=this;
    //弹窗和抽屉初始化
    $(document).unbind("click").bind("click",function (e) {
      if($(e.target).parents(".xsd-select").length==0){
        $(".xsd-select ul").hide();
      }else if($(e.target).attr("readonly")&&$(e.target).parents(".xsd-select").length==1){
        $(".xsd-select ul").hide();
        $(e.target).next().show();
      }
    });
    //版本控制
    if($.cookie('versionNum')){
      _this.set('version', JSON.parse($.cookie('versionNum')));
    }

    $.ajaxSetup({

      complete:function(xhr){
        if(xhr.status===401){
          $.toastr.error("登录失效,请重新登录!");
          _this.get("auth").logout();
          window.location.href="/user/sign"
          // _this.get("router").transitionTo('user.sign',{queryParams:{
          //   target:"login"
          // }});

        }
      }

    });
    $("body").modal();
    $("body").select();
    $("body").tabs();
    $(document).preview();
    $.toastr.init({
      dom:$("body")
    });

    Ember.TextField.reopen({
      attributeBindings:["data-value"]
    });
  },
  actions:{



  }
});

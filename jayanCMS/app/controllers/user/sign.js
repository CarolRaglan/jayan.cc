import Ember from 'ember';
import ajax from 'ic-ajax';
import sendcode from '../../utils/sendcode';

export default Ember.Controller.extend({
      queryParams: ['target'],
      phone_code_token:"",
      flag:true,
      proceed1:false,
      proceed2:false,
      //会员提示弹窗配置
      btn_type:'xufei',
      btn_tip:"申请购买",
      agree: false, //是否同意服务条款
      
      init() {
        // 同意服务条款
        let isAgree = $.cookie('isAgree');
        if (isAgree) {
          this.agree = true;
        }
      }, 
      
      actions:{

         tabClick(e){

            let target=$(e.target).attr("target");
            this.set("target",target)
         },

        showPsd(){

             let dom=$(event.target);
             let type=dom.prev().attr("type");
             if(type=="text"){
                  dom.prev().attr("type","password");
             }else {
                 dom.prev().attr("type","text");
             }
        },

        login(){

          if($('#login').validate()!==true||this.get("proceed1")){
            return;
          }
          if(!this.get('agree')){
            $.toastr.error('请勾选服务条款.');
            return;
          }
          this.set("proceed1",true);
          let userName = $("#username").val();
          let psd = $("#psd").val();
          ajax(this.config.apiUrl + 'users/' + userName  + '/check', {
            method: 'GET'
          }).then((res)=> {
            this.auth.login(userName, psd)
              .then((obj)=> {
                if (!obj) {
                  window.location.href="/index";
                  $.cookie('isAgree', '1',  { expires: 365, path: '/' }); // 同意服务条款
                  //this.get('router').transitionTo("index");//登陆成功跳转
                } else {
                  let status = obj.jqXHR.status;
                  switch(status){
                    case 421:
                      $("#xsd-dl-block").hide();
                      $("#xsd-img-block").show();
                      break;
                    case 422:
                      $.toastr.error('用户已经停用');
                      break;
                    case 423:
                      this.set('phone',userName);
                      $('#publicModal #needBuyTrigger').trigger('click');
                      break;
                    default:
                      $.toastr.error('密码和账户不匹配');
                  }

                }
                this.set("proceed1",false);
              })
          }).catch((xhr, err) => {
             // console.log('obj',err.jqXHR.responseJSON);
             $.toastr.error("账号不存在!");
             this.set("proceed1",false);
          });

        },
        register() {

           if($('#reg').validate()!==true||this.get("proceed2")){
            return;
            }
            if(!this.get('agree')){
              $.toastr.error('请勾选服务条款.');
              return;
            }
            this.set("proceed2",true);
            let phone=$("#phone").val();
            let reg_psd=$("#reg_psd").val();
            let reg_code=$("#reg_code").val();
            let reg_recommend=$("#reg_recommend").val();
            let url = this.config.apiUrl + "users";
            ajax(url, {
              data: {
                "phone": phone,
                "username": phone,
                "password": reg_psd,
                "code": reg_code,
                "referral":reg_recommend
              },
              method: 'POST'
            }).then((res) => {
                this.auth.getInfo(res.data);
                $.toastr.success("注册成功");
                this.get('router').transitionTo("index");
                this.set("proceed2",false);
                // $("#xsd-dl-block").hide();
                // $("#xsd-img-block").show();
            }).catch((err) => {
               $.toastr.error(err.jqXHR.responseJSON.errors.detail)
               this.set("proceed2",false);
            });
        },

        psdStep(){

          if($('#forgetPsd').validate()!==true){
            return;
          }
          let name=$("#f_name").val();
          let f_code=$("#f_code").val();
          let url = this.config.apiUrl1 + "validate_phone_code";
          ajax(url, {
            data: {
              "username": name,
              "code": f_code
            },
            method: 'GET'
          }).then((res) => {
             this.set("phone_code_token",res.phone_code_token);
            $("#forgetPsdContainer").hide();
            $("#nextContainer").show();

          }).catch((err) => {
            $.toastr.error(err.jqXHR.responseJSON.errors.detail)
          });

        },

        resetPsd(){

          if($('#next').validate()!==true){
            return;
          }
          let name=$("#f_name").val();
          let f_code=$("#f_code").val();
          let new_pwd=$("#new_pwd").val();
          let url = this.config.apiUrl1 + "users/reset_password";
          ajax(url, {
            data: {
              "username": name,
              "code": f_code,
              "phone_code_token":this.get("phone_code_token"),
              "new_pwd":new_pwd
            },
            method: 'Post'
          }).then((res) => {
            this.set("phone_code_token","");
            this.set("target","login")
            $.toastr.success('密码修改成功');
          }).catch((err) => {
            $.toastr.error(err.jqXHR.responseJSON.errors.detail)
          });
        },

        tabPrev(){

          $("#forgetPsd").show();
          $("#next").hide();
        },

        verification(e) {

            let dom=$(e.target);
            let phone=dom.parent().prev().find("input").val();
            let Mobile = /^1[3,5,8,4,7]\d{9}$/;
            if(!Mobile.test(phone)){
              $.toastr.error("请输入正确的手机号码!");
              return;
            }
            let txt=dom.text();
            if(txt!="发送验证码"&&txt!="重新发送"){
              return;
            }
            this.get('auth').registerTokenToAjaxHeader();
            ajax(this.config.apiUrl + 'users/' + phone + '/check', {
              method: 'GET'
            }).then((res)=> {
              $.toastr.error("手机号已注册!");
              return;
            }).catch((xhr, err) => {

              sendcode(phone,dom,this.config.apiUrl + "verifycode");

            });
        },

        verificationPsd(e) {

          let dom=$(event.target);
          let phone=dom.parent().prev().find("input").val();
          let txt=dom.text();
          if(txt!="发送验证码"&&txt!="重新发送"){
            return;
          }
          ajax(this.config.apiUrl + 'users/' + phone + '/check', {
            method: 'GET'
          }).then((res)=> {

            sendcode(phone,dom,this.config.apiUrl + "verifycode");

          }).catch((xhr, err) => {
            $.toastr.error("手机号未注册!");
          });
        },

        download(){

          if(this.get("flag")){
            this.set("flag",false);
            $("#download").text("点击返回操作");
            $("#user-func").fadeOut();
            $("#appCode").fadeIn(function () {
              $(this).find(".ios").animate({left:"30px"},function () {
                $(this).addClass("animation")
              })
              $(this).find(".anzhuo").animate({right:"30px"},function () {
                $(this).addClass("animation")
              })
            })
          }else{
            $("#appCode").fadeOut(function () {
              $(this).find(".ios").animate({left:"203px"},function () {
                $(this).removeClass("animation")
              })
              $(this).find(".anzhuo").animate({right:"203px"},function (){
                $(this).removeClass("animation")
              })
            });
            $("#user-func").fadeIn();
            this.set("flag",true);
            $("#download").text("点击下载APP")
          }
        }
      }
});

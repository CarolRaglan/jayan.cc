import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Controller.extend({

    didInsertElement: function () {

    },

    actions:{

        getMsg(){

            let addr=$("#bs_addr").val();
            let pubName=$("#pub_name").val();
            let wxNum=$("#wx_num").val();
            let appId=$("#app_id").val();
            let appSec=$("#app_sec").val();
            let toKen=$("#token").val();
            let barCode=$("#encod_aes_key").val();
            let _this=this;
            let url = this.get("config").apiUrl + "wxpublics";
            this.get('auth').registerTokenToAjaxHeader();
            ajax(url, {
                method: 'post',
                data:{
                    name:pubName,
                    weixin:wxNum,
                    app_id:appId,
                    app_secret:appSec,
                    token:toKen,
                    aes_key:barCode

                }

            }).then((res) => {

              $.toastr.success("绑定成功");
              $("input").attr("disabled",true);

            }).catch((err)=> {
                $.toastr.error(err.jqXHR.responseJSON.errors.detail);

            });

        }

    }

});

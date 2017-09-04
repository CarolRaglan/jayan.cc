
import ajax from 'ic-ajax';

export default function sendcode(phone, dom,url) {

  let num = 60;

   //alert(dom[0].tagName)
  if(dom[0].tagName=="A"){
      dom.text(num + "秒后重新获取").addClass("code_btn");
      var interval = setInterval(function () {
        num = num - 1;
        dom.text(num + "秒后重新获取");
      }, 1000);
      setTimeout(function () {
        clearInterval(interval);
        dom.text("重新发送")
      }, 60000);

  }else{
    dom.val(num + "秒后重新获取");
    dom.attr("disabled", "disabled");
    let interval = setInterval(function () {
      num = num - 1;
      dom.val(num + "秒后重新获取");
      if (num == 0) {
        clearInterval(interval);
        dom.val("重新发送");
        dom.removeAttr("disabled")
      }
    }, 1000);
  }

  ajax(url, {
    data: {
      "phone": phone,
    },
    method: 'GET'
  }).then((res) => {

  }).catch((xhr, err) => {

    $.toastr.error(xhr.jqXHR.responseJSON.errors.detail);
  });


}

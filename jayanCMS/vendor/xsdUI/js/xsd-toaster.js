/**
 * Created by jo on 16/6/25.
 */

  $.toastr={

    init:function (opt) {
     opt.dom.append("<div id='xsd-toastr' class='iconfont'><div")
    },

    success:function (text) {

      $("#xsd-toastr").removeClass("xsd-toastr-error").addClass("xsd-toastr-success").html('&#xe664;&nbsp;'+text).fadeIn(200);
      clearTimeout(window.time1);
      window.time1=setTimeout(function () {
        $("#xsd-toastr").fadeOut(300);
      },2000)
    },

    error:function (text) {

      $("#xsd-toastr").removeClass("xsd-toastr-success").addClass("xsd-toastr-error").html('&#xe665;&nbsp;'+text).fadeIn(200);
      clearTimeout(window.time2);
      window.time2=setTimeout(function () {
        $("#xsd-toastr").fadeOut(300);
      },2000)

    }

  }

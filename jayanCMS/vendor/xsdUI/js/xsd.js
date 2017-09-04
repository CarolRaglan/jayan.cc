/**
 *
 * @author jo.li
 * @time 2016.06.13
 *
 */

(function ($) {
  /*
   *
   * 弹层和抽屉
   *
   * */
  $.fn.modal = function () {

    this.on("click",
      "a[data-toggle='xsd-modal'], " +
      "a[data-toggle='xsd-drawer']," +
      "td[data-toggle='xsd-drawer']," +
      "tr[data-toggle='xsd-drawer']"
      , function (e) {
        var id = $(this).attr("data-target");
        show(this, id);
        $(id + " .xsd-modal-close").unbind("click").bind("click", close);
        if ($(this).attr('data-toggle') != 'xsd-modal') {
          $("#xsd-mask").unbind('click').bind("click", function () {
            $(id + " .xsd-modal-close").trigger("click");
          });
        }

        e.stopPropagation();
      });

    function show(dom, id) {

      if ($(dom).attr("data-toggle") === "xsd-modal") {
        $("#xsd-modal-mask").fadeIn(200);
        $(id).show(400);
        window.modal_show = true;
      } else {
        $("#xsd-mask").fadeIn(200);
        $(id).animate({right: "0px"}, 400);
        window.drawer_show = true;
      }
      $("body").addClass("hideScroll");
    };

    function close() {

      if ($(this).parents(".xsd-modal").length == 1) {

        var dom = $(this).parents(".xsd-modal");
        $(dom).hide(400);
        $("#xsd-modal-mask").fadeOut(200);
        if ($("#xsd-mask").css("display") != "block") {
          $("body").removeClass("hideScroll");
        }
        window.modal_show = false;
      } else {

        var dom = $(this).parents(".xsd-drawer");
        $(dom).animate({right: "-768px"}, 400);
        $("#xsd-mask").fadeOut(200);
        $("body").removeClass("hideScroll");
        window.drawer_show = false;
      }
    };
  }

  // var lastShownDropMenu = null;
  /*
   *
   * 下拉选择
   *
   * */
  $.fn.select = function () {

    this.on("click", ".xsd-select input", function (e) {
      $('.xsd-select ul').hide();
      var dom = $(this).parent().find("ul");
      // if(lastShownDropMenu && lastShownDropMenu.is(':visible')){
      //   lastShownDropMenu.hide();
      // }
      dom.show();
      // lastShownDropMenu = dom;
      dom.on("click", "li", function (e) {
        var dom1 = dom.parent().find("input");
        var value = $(this).attr("data-value");
        if (value != undefined) {
          dom1.attr("data-value", value);
        }
        dom1.val($(this).text()).change();
        dom.hide();
        return false;
      });
      e.stopPropagation();
    });
  }

  /*
   *
   * tabs选项卡
   *
   * */
  $.fn.tabs = function () {

    this.on("click", ".xsd-nav-tabs li", function (e) {
      $(this).parent().find("li").removeClass("active");
      $(this).addClass("active");
      var target = $(this).find("a").attr("data-href");
      var dom = $(this).parent().next();
      dom.find(".xsd-tab-pane").removeClass("active");
      dom.find(target).addClass("active");
    });
  }

  /*
   *
   * 图片轮播
   *
   * */
  $.fn.slider = function (space) {

    var i = 0;
    var dom = this;
    var timer = setInterval(slider, 5000);

    $(dom).next().find("a").click(function () {

      clearInterval(timer);
      var num = $(this).attr("data-index");
      shift(num);
      timer = setInterval(slider, 5000);
    })

    function slider() {
      i++;
      if (i > 2) {
        i = 0;
      }

      shift(i)

    };

    function shift(num) {

      $(dom).animate({left: -space * num + "px"}, 400, function () {
        $(this).next().find("a").removeClass("active");
        $($(this).next().find("a")[num]).addClass("active");
      });

    }

  }

  /*
   *
   * 图片放大
   * @author: helone
   * fix 数量计算上下文，语法优化，逻辑 2017-05-27
   * */
  $.fn.preview = function () {

    this.on('click', 'img[data-img-preview]', function (e) {
      var list = $(this).closest('ul').find('img[data-img-preview]'),
        index = $(this).parent().prevUntil().length,
        image = $(this).attr('src'),
        length = list.length;
      var html =
        '<div class="img-preview-container">' +
          '<div class="img-preview-background"></div>' +
          '<div class="img-preview-main">' +
            '<div class="img-preview-content">' +
            '<img src="' + image + '">' +
            '<span class="img-preview-close"><i class="iconfont">&#xe633;</i></span>' +
            '<span class="img-preview-prev"><i class="iconfont font-size">&#xe614;</i></span>' +
            '<span class="img-preview-next"><i class="iconfont font-size">&#xe613;</i></span>' +
            '<span class="img-preview-title">图片位置：<span class="blue">' + (index + 1) + '</span> / ' + length + '</span>' +
            '</div>' +
          '</div>' +
        '</div> ';

      $('body').append(html);

      $('.img-preview-close').off().on('click', function () {
        $('.img-preview-container').remove();
      });

      $('.img-preview-prev').off().on('click', function () {
        if(index<1){
          $.toastr.error("没有上一张图片了");
          return ;
        }
        index--;
        var src = list.eq(index).attr('src');
        $('.img-preview-title .blue').text(index+1);
        $('.img-preview-content img').attr('src', src);
      });

      $('.img-preview-next').off().on('click', function () {
        if(index>=list.length-1){
          $.toastr.error("没有下一张图片了");
          return;
        }
        index++;
        var src = list.eq(index).attr('src');
        $('.img-preview-title .blue').text(index + 1);
        $('.img-preview-content img').attr('src', src);
      });
    });
  };

  // 金额转大写
  $.fn.changeMoneyToChinese=function( money ){

    var cnNums = new Array("零","壹","贰","叁","肆","伍","陆","柒","捌","玖"); //汉字的数字
    var cnIntRadice = new Array("","拾","佰","仟"); //基本单位
    var cnIntUnits = new Array("","万","亿","兆"); //对应整数部分扩展单位
    var cnDecUnits = new Array("角","分","毫","厘"); //对应小数部分单位
    var cnInteger = "整"; //整数金额时后面跟的字符
    var cnIntLast = "元"; //整型完以后的单位
    var maxNum = 999999999999999.9999; //最大处理的数字
    var IntegerNum; //金额整数部分
    var DecimalNum; //金额小数部分
    var ChineseStr=""; //输出的中文金额字符串
    var parts; //分离金额后用的数组，预定义

    if( money == "" ){
      return "";
    }

    money = parseFloat(money);
    //alert(money);
    if( money >= maxNum ){
      $.alert('超出最大处理数字');
      return "";
    }
    if( money == 0 ){
      ChineseStr = cnNums[0]+cnIntLast+cnInteger;
    //document.getElementById("show").value=ChineseStr;
      return ChineseStr;
    }
    money = money.toString(); //转换为字符串
    if( money.indexOf(".") == -1 ){
      IntegerNum = money;
      DecimalNum = '';
    }else{
      parts = money.split(".");
      IntegerNum = parts[0];
      DecimalNum = parts[1].substr(0,4);
    }
    if( parseInt(IntegerNum,10) > 0 ){//获取整型部分转换
      zeroCount = 0;
      IntLen = IntegerNum.length;
      for( i=0;i<IntLen;i++ ){
        n = IntegerNum.substr(i,1);
        p = IntLen - i - 1;
        q = p / 4;
        m = p % 4;
        if( n == "0" ){
          zeroCount++;
        }else{
          if( zeroCount > 0 ){
            ChineseStr += cnNums[0];
          }
          zeroCount = 0; //归零
          ChineseStr += cnNums[parseInt(n)]+cnIntRadice[m];
        }
        if( m==0 && zeroCount<4 ){
          ChineseStr += cnIntUnits[q];
        }
      }
      ChineseStr += cnIntLast;
      //整型部分处理完毕
    }
    if( DecimalNum!= '' ){//小数部分
      decLen = DecimalNum.length;
      for( i=0; i<decLen; i++ ){
        n = DecimalNum.substr(i,1);
        if( n != '0' ){
          ChineseStr += cnNums[Number(n)]+cnDecUnits[i];
        }
      }
    }
    if( ChineseStr == '' ){
      ChineseStr += cnNums[0]+cnIntLast+cnInteger;
    }
    else if( DecimalNum == '' ){
      ChineseStr += cnInteger;
    }
    return ChineseStr;

  }


})(jQuery)


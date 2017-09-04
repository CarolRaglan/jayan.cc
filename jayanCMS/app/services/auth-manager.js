import Ember from 'ember';
import ajax from 'ic-ajax';
import config from '../config/environment';

/**
 * 用于处理用户:
 * 1. 登陆
 * 2. 登出
 * 3. 登陆后用户信息
 * 4. 登陆后保存状态的信息
 */
export default Ember.Service.extend({

  authToken: null,
  user: null,
  e_power:null,//分散式权限
  c_power:null,
  cookieType:{ expires: 30,path:'/',domain:config.domain},
  provinceArr:null,
  cityArr:null,
  cityList:null,


  init(){
    jQuery.support.cors = true;
    if(window.location.host.indexOf("localhost")!=-1){
      this.set("cookieType",{ expires: 7,path:'/'})
    }

    if($.cookie('authToken')!=undefined&&$.cookie('user')!=undefined&&$.cookie('c_power')!=undefined&&$.cookie('e_power')!=undefined){
      this.reloadFromStoreage();
      //添加给user一些信息
      this.cookUser();
    }
    let _this=this;
    $.getJSON(config.apiUrl+'city/search?callback=?', function (data) {
      _this.set('cityList', data['results']);
    });
   let provinceArr = [];
   let cityArr = [];
    //province
    provinceArr[0] = ['北京市'];
    provinceArr[1] = ['天津市'];
    provinceArr[2] = ['上海市'];
    provinceArr[3] = ['重庆市'];
    provinceArr[4] = ['河北省'];
    provinceArr[5] = ['河南省'];
    provinceArr[6] = ['云南省'];
    provinceArr[7] = ['辽宁省'];
    provinceArr[8] = ['黑龙江省'];
    provinceArr[9] = ['湖南省'];
    provinceArr[10] = ['安徽省'];
    provinceArr[11] = ['山东省'];
    provinceArr[12] = ['新疆'];
    provinceArr[13] = ['江苏省'];
    provinceArr[14] = ['浙江省'];
    provinceArr[15] = ['江西省'];
    provinceArr[16] = ['湖北省'];
    provinceArr[17] = ['广西壮族'];
    provinceArr[18] = ['甘肃省'];
    provinceArr[19] = ['山西省'];
    provinceArr[20] = ['内蒙古'];
    provinceArr[21] = ['陕西省'];
    provinceArr[22] = ['吉林省'];
    provinceArr[23] = ['福建省'];
    provinceArr[24] = ['贵州省'];
    provinceArr[25] = ['广东省'];
    provinceArr[26] = ['青海省'];
    provinceArr[27] = ['西藏'];
    provinceArr[28] = ['四川省'];
    provinceArr[29] = ['宁夏回族'];
    provinceArr[30] = ['海南省'];
    provinceArr[31] = ['台湾省'];
    provinceArr[32] = ['香港特别行政区'];
    provinceArr[33] = ['澳门特别行政区'];
    //city
    cityArr[0] = ['北京市'];
    cityArr[1] = ['天津市'];
    cityArr[2] = ['上海市'];
    cityArr[3] = ['重庆市'];
    cityArr[4] = ['石家庄市', '唐山市', '秦皇岛市', '邯郸市', '邢台市', '保定市', '张家口市', '承德市', '沧州市', '廊坊市', '衡水市'];
    cityArr[5] = ['郑州市','开封市','洛阳市', '平顶山市', '安阳市', '鹤壁市', '新乡市', '焦作市', '济源市', '濮阳市', '许昌市', '漯河市', '三门峡市', '南阳市', '商丘市', '信阳市', '周口市', '驻马店市'];
    cityArr[6] = ['昆明市',' 曲靖市','玉溪市','保山市','昭通市','丽江市','思茅市','临沧市','楚雄彝族自治州','红河哈尼族彝族自治州','文山壮族苗族自治州','西双版纳傣族自治州','大理白族自治州','德宏傣族景颇族自治州','怒江傈僳族自治州','迪庆藏族自治州'];
    cityArr[7] = ['沈阳市' ,'大连市' ,'鞍山市' ,'抚顺市' ,'本溪市' ,'丹东市' ,'锦州市' ,'营口市' ,'阜新市' ,'辽阳市' ,'盘锦市' ,'铁岭市' ,'朝阳市' ,'葫芦岛市'];
    cityArr[8] = ['哈尔滨市','齐齐哈尔市','鸡西市','鹤岗市','双鸭山市', '大庆市', '伊春市', '佳木斯市', '七台河市', '牡丹江市', '黑河市', '绥化市', '大兴安岭地区'];
    cityArr[9] = ['长沙市', '株洲市','湘潭市', '衡阳市', '邵阳市', '岳阳市', '常德市', '张家界市', '益阳市', '郴州市', '永州市', '怀化市', '娄底市', '湘西土家族苗族自治州'];
    cityArr[10] = ['合肥市', '芜湖市', '蚌埠市', '淮南市', '马鞍山市', '淮北市', '铜陵市', '安庆市', '黄山市', '滁州市','阜阳市','宿州市', '巢湖市', '六安市', '亳州市', '池州', '宣城市'];
    cityArr[11] = ['济南市','青岛市','淄博市','枣庄市','东营市','烟台市','潍坊市','济宁市','泰安市','威海市','日照市','莱芜市','临沂市','德州市','聊城市','滨州市','菏泽市'];
    cityArr[12] = ['新疆维吾尔自治区','乌鲁木齐市', '克拉玛依市', '吐鲁番地区', '哈密地区', '昌吉回族自治州 ', '博尔塔拉蒙古自治州 ', '巴音郭楞蒙古自治州 ', '阿克苏地区', '克孜勒苏柯尔克孜自治州 ', '喀什地区', '和田地区', '伊犁哈萨克自治州', '塔城地区', '阿勒泰地区', '石河子市', '阿拉尔市', '图木舒克市', '五家渠市' ];
    cityArr[13] = ['南京市', '无锡市', '徐州市', '常州市', '苏州市', '南通市', '连云港市', '淮安市', '盐城市', '扬州市', '镇江市', '泰州市', '宿迁市' ];
    cityArr[14] = ['杭州市', '宁波市', '温州市', '嘉兴市', '湖州市', '绍兴市', '金华市', '衢州市', '舟山市', '台州市', '丽水市'];
    cityArr[15] = ['南昌市','景德镇市','萍乡市','九江市','新余市','鹰潭市','赣州市','吉安市','宜春市','抚州市','上饶市'];
    cityArr[16] = ['武汉市','黄石市','十堰市', '宜昌市', '襄樊市', '鄂州市', '荆门市', '孝感市', '荆州市', '黄冈市', '咸宁市', '随州市', '恩施土家族苗族自治州','仙桃市', '潜江市', '天门市', '神农架林区'];
    cityArr[17] = ['广西壮族','南宁市','柳州市','桂林市','梧州市','北海市','防城港市','钦州市','贵港市','玉林市','百色市','贺州市','河池市','来宾市','崇左市'];
    cityArr[18] = ['兰州市','嘉峪关市', '金昌市', '白银市', '天水市', '武威市', '张掖市', '平凉市', '酒泉市', '庆阳市', '定西市', '陇南市', '临夏回族自治州', '甘南藏族自治州'];
    cityArr[19] = ['太原市','大同市', '阳泉市', '长治市', '晋城市', '朔州市', '晋中市', '运城市', '忻州市', '临汾市', '吕梁市' ];
    cityArr[20] = ['内蒙古自治区','呼和浩特市', '包头市', '乌海市', '赤峰市', '通辽市', '鄂尔多斯市', '呼伦贝尔市', '巴彦淖尔市', '乌兰察布市', '兴安盟', '锡林郭勒盟', '阿拉善盟' ];
    cityArr[21] = ['西安市','铜川市','宝鸡市', '咸阳市', '渭南市', '延安市', '汉中市', '榆林市', '安康市', '商洛市' ];
    cityArr[22] = ['长春市', '吉林市', '四平市', '辽源市', '通化市', '白山市', '松原市', '白城市', '延边朝鲜族自治州'];
    cityArr[23] = ['福州市', '厦门市', '莆田市', '三明市', '泉州市', '漳州市', '南平市', '龙岩市', '宁德市' ];
    cityArr[24] = ['贵阳市','六盘水市', '遵义市', '安顺市', '铜仁地区', '黔西南布依族苗族自治州', '毕节地区', '黔东南苗族侗族自治州', '黔南布依族苗族自治州'];
    cityArr[25] = ['广州市','韶关市','深圳市','珠海市','汕头市','佛山市','江门市','湛江市','茂名市','肇庆市','惠州市','梅州市','汕尾市','河源市','阳江市','清远市','东莞市','中山市','潮州市','揭阳市','云浮市'];
    cityArr[26] = ['西宁市' ,'海东地区', '海北藏族自治州', '黄南藏族自治州', '海南藏族自治州', '果洛藏族自治州', '玉树藏族自治州', '海西蒙古族藏族自治州'];
    cityArr[27] = ['拉萨市','昌都地区', '山南地区', '日喀则地市', '那曲地区', '阿里地区', '林芝地区' ];
    cityArr[28] = ['成都市','自贡市', '攀枝花市', '泸州市', '德阳市', '绵阳市', '广元市', '遂宁市', '内江市', '乐山市', '南充市', '眉山市', '宜宾市', '广安市', '达州市', '雅安市', '巴中市', '资阳市', '阿坝藏族羌族自治州', '甘孜藏族自治州', '凉山彝族自治州'];
    cityArr[29] = ['宁夏回族','银川市','石嘴山市','吴忠市','固原市','中卫市'];
    cityArr[30] = ['海口市','三亚市','五指山市', '琼海市', '儋州市', '文昌市', '万宁市', '东方市', '定安县', '屯昌县', '澄迈县', '临高县', '白沙黎族自治县', '昌江黎族自治县', '乐东黎族自治县', '陵水黎族自治县', '保亭黎族苗族自治县', '琼中黎族苗族自治县' ];
    this.set("provinceArr",provinceArr);
    this.set("cityArr",cityArr);


  },

  login(username, password) {
    var _this=this;
    var url = config.apiUrl + "auth";
    //去掉了登陆或者注册先去缓存里面拿token  @jo
    if(Ember.isPresent(username) && Ember.isPresent(password)) {
      return ajax(url, {
        data: {username: username, password: password,terminal:"PC"},
        method: 'POST',
        async:false
      }).then((res) => {
        this.getInfo(res);

      }).catch((xhr, err) => {
        return xhr;
      });
    } else {
      // 一定要返回一个 Promise 对象
      return new Ember.RSVP.resolve(false);
    }
  },

  /**
   * 登出
   */
  logout() {
    this.set('authToken', null);
    this.set('user', null);
    this.set('e_power', null);
    this.set('c_power', null);
    this.set('provinceArr', null);
    this.set('cityArr', null);
    $.removeCookie('authToken', { path: '/', domain:config.domain });
    $.removeCookie('user', { path: '/', domain:config.domain });
    $.removeCookie('e_power', { path: '/', domain:config.domain });
    $.removeCookie('c_power', { path: '/', domain:config.domain });

    delete Ember.$.ajaxSetup.beforeSend;
  },

  getInfo(res){
    this.set('authToken', {access_token: res.token, token_type: "token"});
    this.set('user', res);
    //添加给user一些信息
    this.cookUser();
    this.persistToken();
    this.getPower(res.role,res.id);
  },
  /*员工权限管理*/

  getPower:function(type,id){

    let _this=this;
    _this.registerTokenToAjaxHeader();
    let url=config.apiUrl2 +"employerpmss/"+id;
    let url1=config.apiUrl +"employerpmss/"+id;

    ajax(url,{
      method:"GET",
      async:false,
      data:{
        'type':type
      }
    }).then((data)=>{

      _this.set("c_power",data.data.attributes.page_codes);

    }).catch((err)=>{
      $.toastr.error("获取员工集中式权限失败！")
    });

    ajax(url1,{
      method:"GET",
      async:false,
      data:{
        'type':type
      }
    }).then((data)=>{
      _this.set("e_power",data.data.attributes.page_codes);
      _this.persistPower();
    }).catch((err)=>{
      $.toastr.error("获取员工分散式权限失败！")
    })


  },
  /**
   * 持久化 token 进入 localStorage
   * 通过 observ 的模式监听两个元素的变化. (需要在页面上调用)
   */
  persistPower(){

    $.cookie('e_power', JSON.stringify(this.get('e_power')),this.get("cookieType"));
    $.cookie('c_power', JSON.stringify(this.get('c_power')),this.get("cookieType"));
  },

  persistToken(){

    $.cookie('authToken', JSON.stringify(this.get('authToken')),this.get("cookieType"));
    $.cookie('user', JSON.stringify(this.get('user')),this.get("cookieType"));
    return '';
  },

  reloadFromStoreage(){

    this.set('authToken', JSON.parse($.cookie('authToken')));
    this.set('user', JSON.parse($.cookie('user')));
    this.set('e_power', JSON.parse($.cookie('e_power')));
    this.set('c_power', JSON.parse($.cookie('c_power')));
    return this.get('isLogin');
    // return false;
  },

  registerTokenToAjaxHeader(){
    var service = this;
    if(Ember.isBlank($.ajaxSetup.beforeSend)) {
      Ember.$.ajaxSetup({
        beforeSend(xhr) {
          if(service.get('isLogin')) {
            xhr.setRequestHeader('Authorization', `${service.get('token_type')} ${service.get('token')}`);
          }
        }
      });
    }
  },
  //全局user料理一些信息
  cookUser(){
    let user = this.get("user");
    if(typeof(user)=='object'){
      //vip判断
      if(user.vip_level>0){
        user.is_vip = true;
      }else{
        user.is_vip = false;
      }
    }
  },
  // 是否登录
  isLogin: function() {
    return (Ember.isPresent(this.get('token')) && Ember.isPresent(this.get('token_type')));
  }.property('authToken'),

  //  --------------- after login -------------------

  token: function() {
    return this.get('authToken.access_token');
  }.property('authToken'),

  token_type: function() {
    return this.get('authToken.token_type');
  }.property('authToken'),

  account: function() {
    return this.get('user');
  }.property('user')
});



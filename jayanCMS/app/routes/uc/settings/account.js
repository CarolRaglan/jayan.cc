import Ember from 'ember';

let modes = [{name: '分散式',value:1}, {name: '集中式',value:2}, {name: '混合经营',alias:'混合模式',value:0}];
let v = {
  name: {
    name: '账户昵称',
    required: true,
    input: 'name'
  },
  account: {
    name: '注册账号',
    required: true,
    input: 'mobile'
  },
  brand: {
    name: '公寓品牌',
    required: true,
    input: 'brand'
  },
  company: {
    name: '公司名称',
    required: true,
    input: 'company'
  },
  city: {
    name: '所在省市',
    required: true,
    input:['province','city']
  },
  mode:{
    name:'经营模式',
    depends:['modes'],
    required:({modes})=>{
      return modes.find(it=>it.active);
    }
  },
  suffix: {
    name: '子账号登陆后缀名',
    required: true,
    input: 'suffix'
  }
};

export default Ember.Route.extend({

  renderTemplate() {
    this.render("uc/settings/account", {  //使用模板的位置 (templates/)uc/settings/extras(.hbs)
      outlet: "uc",   //渲染到名叫 'user' 的outlet组件（即“ {{outlet 'uc'}} ”）中
      into: "uc/index"   //"outlet"位于路径为(template/)uc/index(.hbs)的模板文件
    });
  },

  setupController(controller, model){
    let auth = this.get('auth');
    let cityList = [];
    console.assert(auth.user,'auth.user 为空');
    let province = auth.user.province;
    let provinceIndex = auth.provinceArr.findIndex(it=>it.includes(province));
    if(provinceIndex){
      cityList = auth.cityArr[provinceIndex];
    }
    let mode = modes.find(it=>it.name===auth.user.operate_mode || it.alias===auth.user.operate_mode);
    if(mode){
      mode.active = true;
    }
    controller.set('v', v);
    controller.set('city',auth.user.city);
    controller.set('province',auth.user.province);
    controller.set('cityList',cityList);
    controller.set('modes', modes);  //经营方式
    controller.set('model', model);
  }


});

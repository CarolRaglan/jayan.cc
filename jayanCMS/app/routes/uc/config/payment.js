import Ember from 'ember';

export default Ember.Route.extend({

  renderTemplate() {
    this.render("uc/config/payment", {  //使用模板的位置 (templates/)user/config/extras(.hbs)
      outlet: "uc",   //渲染到名叫 'user' 的outlet组件（即“ {{outlet 'user'}} ”）中
      into: "uc/index"   //"outlet"位于路径为(template/)user/index(.hbs)的模板文件
    });
  }

});

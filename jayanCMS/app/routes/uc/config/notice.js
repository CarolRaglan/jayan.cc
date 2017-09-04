import Ember from 'ember';

export default Ember.Route.extend({

  renderTemplate() {
    this.render("uc/config/notice", {  //使用模板的位置 (templates/)uc/config/notice(.hbs)
      outlet: "uc",   //渲染到名叫 'user' 的outlet组件（即“ {{outlet 'uc'}} ”）中
      into: "uc/index"   //"outlet"位于路径为(template/)uc/index(.hbs)的模板文件
    });
  }

});

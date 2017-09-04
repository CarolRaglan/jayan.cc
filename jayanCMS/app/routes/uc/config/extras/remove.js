import Ember from 'ember';

export default Ember.Route.extend({

  renderTemplate(controller,model) {
    this.render("modal", {  //使用模板的位置 (templates/)modal(.hbs)
      into: "application",   //"outlet"位于路径为(template/)application(.hbs)的模板文件
      outlet: "sky"   //渲染到名叫 'sky' 的outlet组件（即“ {{outlet 'sky'}} ”）中
    });
    this.render("uc/config/extras/remove", {  //使用模板的位置 (templates/)uc/config/extras/remove(.hbs)
      into: "modal",   //"outlet"位于路径为(template/)modal(.hbs)的模板文件
      outlet: "modal"   //渲染到名叫 'modal' 的outlet组件（即“ {{outlet 'modal'}} ”）中
    });
  }

});

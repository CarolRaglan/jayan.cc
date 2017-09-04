import Ember from 'ember';

export default Ember.Route.extend({

  renderTemplate() {
    this.render("modal", {  //使用模板的位置 (templates/)modal(.hbs)
      into: "application",   //"outlet"位于路径为(template/)application(.hbs)的模板文件
      outlet: "sky"   //渲染到名叫 'sky' 的outlet组件（即“ {{outlet 'sky'}} ”）中
    });
    this.render("uc/config/extras/add", {  //使用模板的位置 (templates/)uc/config/extras/add(.hbs)
      into: "modal",   //"outlet"位于路径为(template/)modal(.hbs)的模板文件
      outlet: "modal"   //渲染到名叫 'modal' 的outlet组件（即“ {{outlet 'modal'}} ”）中
    });
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('fee',null);
  }

});

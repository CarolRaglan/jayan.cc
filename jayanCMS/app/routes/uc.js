import Ember from 'ember';

export default Ember.Route.extend({

  renderTemplate() {
    this.render('uc/index');    // 渲染模板 templates/user/index.hbs
  }

});

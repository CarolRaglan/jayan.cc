import Ember from 'ember';
/**
 * tabs 组件
 * 可接受的属性有：
 * @property list {object} <required>
 *     tab的渲染数组;
 * @property change {action} <optional>
 *     行为钩子，当tab内部有变化，会触发对应的action;
 *
 *  另外一些继承的属性可用： 比如 id , class等
 */
export default Ember.Component.extend({

  tagName:'ul',
  classNames:'tabs',

  actions: {

    toggleTab:function(it){
      this.sendAction('change',it);
    }

  }

});

import Ember from 'ember';

export default Ember.Component.extend({
  tagName:'label',
  classNames:'ui-btn-toggle',
  tips:{
    on:'展开',
    off:'关闭'
  },
  nt:Ember.computed.alias('tips.on'), //打开时的提示方案
  ft:Ember.computed.alias('tips.off') //关闭时的提示方案
});

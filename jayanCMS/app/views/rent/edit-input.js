import Ember from 'ember';

export default Ember.View.extend({
  tagName: 'input',
  attributeBindings: ['disabled','type','placeholder',"value","id",'validate','title'],
  classNameBindings: ['propertyA', 'propertyB'],
  propertyA:"xsd-input",
  propertyB:Ember.computed(function () {
    if (this.get("flag")) {
      return "gray xsd-noborder";
    } else {
      return "";
    }
  }),
  value: Ember.computed(function () {
    if (this.get("value")=="") {
      return 0;
    } else {
      return this.get("value");
    }
  }),
  disabled: Ember.computed(function () {
    if (this.get("flag")) {
      return true;
    } else {
      return false;
    }
  })
});

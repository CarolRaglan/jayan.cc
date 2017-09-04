import Ember from 'ember';

export function dataMenus(params/*, hash*/) {

  let flag=window.location.href.indexOf(params[0]);
  if(flag>=0){
    return "active"
  }else {
    return "";
  }

}

export default Ember.Helper.helper(dataMenus);

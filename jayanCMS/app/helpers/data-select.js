import Ember from 'ember';

export function dataSelect(params/*, hash*/) {
  
  if (params[0] != undefined) {
    let flag = params[0].indexOf(params[1]);

    if (flag >= 0) {
      return "select"
    } else {
      return "";
    }
  }
}

export default Ember.Helper.helper(dataSelect);

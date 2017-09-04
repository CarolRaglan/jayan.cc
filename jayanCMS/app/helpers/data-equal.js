import Ember from 'ember';

export function dataEqual(params/*, hash*/) {

  if(params[2]==="empty"||params[2]===""||params[2]===false){
    return "xsd-none"
  }
  if(params[0]==params[1]){
    return "active"
  }else {
    return "";
  }
}

export default Ember.Helper.helper(dataEqual);

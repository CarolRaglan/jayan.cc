import Ember from 'ember';

export function staffHouse(params/*, hash*/) {
  if(params[1]===undefined){
    params[1]="";
  }
  if (params[1].indexOf(params[0]) != -1) {
    return "checked";
  }else{
    return "";
  }

}

export default Ember.Helper.helper(staffHouse);


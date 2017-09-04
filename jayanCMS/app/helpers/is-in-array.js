import Ember from 'ember';

export function isInArray(params/*, hash*/) {
  if(params[0].indexOf(params[1])!=-1){
    return true;
  }

}

export default Ember.Helper.helper(isInArray);

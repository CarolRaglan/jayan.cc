import Ember from 'ember';

export function borderExist(params/*, hash*/) {
  
  if(params[0]){
    return "xsd-noborder"
  }
}

export default Ember.Helper.helper(borderExist);

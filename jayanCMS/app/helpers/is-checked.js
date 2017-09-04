import Ember from 'ember';

export function isChecked(params/*, hash*/) {
  if (params[0] == params[1]) {
    return true;
  } else if (params[0] != params[1]) {
      return "";
  }

}

export default Ember.Helper.helper(isChecked);

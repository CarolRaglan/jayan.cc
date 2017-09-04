import Ember from 'ember';

export function absoluteValue(params/*, hash*/) {

  if (params[0] < 0) {
    return Math.abs(params[0]);
  } else {
    return params[0];
  }

}

export default Ember.Helper.helper(absoluteValue);

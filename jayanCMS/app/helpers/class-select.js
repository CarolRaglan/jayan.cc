import Ember from 'ember';

export function classSelect(params) {
  if (params[1] === 'finance') {
    if (params[0] === 'finance' || params[0] === 'payment' ) {
      return 'active'
    }
  }
  return '';
}

export default Ember.Helper.helper(classSelect);

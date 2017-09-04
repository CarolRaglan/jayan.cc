import Ember from 'ember';

export function valueExist(params/*, hash*/) {

    if (!params[0]) {
      return 0;
    } else {
      return params[0];
    }

}

export default Ember.Helper.helper(valueExist);

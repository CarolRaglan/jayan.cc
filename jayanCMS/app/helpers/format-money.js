import Ember from 'ember';

export function formatMoney(params/*, hash*/) {

  return (params[0]/10000).toFixed(2);

}

export default Ember.Helper.helper(formatMoney);

import Ember from 'ember'
let abs =  function([v]) {
  return Math.abs(v);
}
export default Ember.Helper.helper(abs)

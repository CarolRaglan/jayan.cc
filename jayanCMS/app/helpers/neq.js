import Ember from 'ember'
let neq =  function([a,b]) {
  return a != b;
}
export default Ember.Helper.helper(neq)

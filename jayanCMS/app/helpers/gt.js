import Ember from 'ember'
let gt =  function([a,b]) {
  return a>b;
}
export default Ember.Helper.helper(gt)

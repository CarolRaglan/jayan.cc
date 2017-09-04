import Ember from 'ember'
let merge =  function(arr) {
  return arr.find(it => it===0 || it);
}
export default Ember.Helper.helper(merge)

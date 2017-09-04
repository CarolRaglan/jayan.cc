import Ember from 'ember'
let alter =  function([value,list=[],key]) {
  return value||list[0][key]||'';
}
export default Ember.Helper.helper(alter)

import Ember from 'ember'
let concat =  function(arr) {
  return arr.reduce((a,b) => a+''+b);
}
export default Ember.Helper.helper(concat)

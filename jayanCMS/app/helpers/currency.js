import Ember from 'ember'
let currency =  function([n]) {
  return (n===null||n===undefined||n==='')?n:n.toFixed(2);
}
export default Ember.Helper.helper(currency)

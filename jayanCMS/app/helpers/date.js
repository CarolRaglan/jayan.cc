import Ember from 'ember'
import moment from 'moment'
let toDate =  function([date,format='YYYY-MM-DD']) {
  return moment(date,format).toDate();
}
export default Ember.Helper.helper(toDate)

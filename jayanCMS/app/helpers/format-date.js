import Ember from 'ember';

export function formatDate(params/*, hash*/) {
  if(params[1]==1&&params[0]&&params[0].toString().indexOf("CST")==-1){

    return params[0].split(" ")[1];
  }

}

export default Ember.Helper.helper(formatDate);

/**
 * Created by CarlosLi on 17/2/17.
 */

import Ember from 'ember';

export function ifCond(params/*, hash*/) {
  let v1=params[0];
  let operator=params[1];
  let v2=params[2];
  switch (operator) {
    case '==':
      return (v1 == v2) ;
    case '===':
      return (v1 === v2) ;
    case '!=':
      return (v1 != v2) ;
    case '!==':
      return (v1 !== v2) ;
    case '<':
      return (v1 < v2) ;
    case '<=':
      return (v1 <= v2) ;
    case '>':
      return (v1 > v2) ;
    case '>=':
      return (v1 >= v2) ;
    case '&&':
      return (v1 && v2) ;
    case '||':
      return (v1 || v2) ;
    default:
      return false;
  }

}

export default Ember.Helper.helper(ifCond);

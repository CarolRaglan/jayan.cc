/**
 * Created by Administrator on 2017/3/14 0014.
 */
import Ember from 'ember';

export function dataShow(params/*, hash*/) {

  if(params[3]==="empty"||params[3]===""||params[3]===false){
    return "xsd-none"
  }
  if((params[0]==params[1])||(params[0]==params[2])){
    return "addSty"
  }else {
    return "";
  }
}

export default Ember.Helper.helper(dataShow);

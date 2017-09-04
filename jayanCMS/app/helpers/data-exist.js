import Ember from 'ember';

export function dataExist(params/*, hash*/) {

  let flag=false;

  $.each(params,function (i,value) {
    
      if(value!=""){
        flag=true;
        return;
      }
  })

  return flag;
}

export default Ember.Helper.helper(dataExist);

import Ember from 'ember';

export function dataPlus(params/*, hash*/) {
  let sum=0;
  if(params.length==2){

    if(params[0]!=undefined&&params[1]!=undefined&&params){

      sum=params[0]+params[1];


    }
  }else if(params.length==3&&params[2]=="date"){

      sum=moment(params[0]).add(params[1], 'days').format('YYYY-MM-DD');

  }

  return sum;
}

export default Ember.Helper.helper(dataPlus);

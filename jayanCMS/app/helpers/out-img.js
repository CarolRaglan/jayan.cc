import Ember from 'ember';

export function outImg(params/*, hash*/) {

  if(params[1]==3){
    return "../images/rent/icon5.png";
  }else if(params[1]==1||params[1]==2){
    return "../images/rent/icon2.png";
  }else if(params[0]==3){
    return "../images/rent/icon4.png";
  }else if(params[0]==1||params[0]==2){
    return "../images/rent/icon3.png";
  }

}

export default Ember.Helper.helper(outImg);

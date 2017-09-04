import Ember from 'ember'
//ember辅助函数，对比两个值是否相等。值可以是对象。
export function eq([one, another, eqResult, neqResult ]) {
  //基础数据类型以及null算作基础类型，即isBasic函数对它们返回true
  let isBasic = (it) => {
    return it===null || ( typeof it !== 'object' && typeof it !== 'array' );
  };
  let lengthEqual = function (a,b) {
    if(Array.isArray(a) && Array.isArray(b)){
      return a.length === b.length;
    }else if( typeof a ==='object' && typeof b === 'object' ){
      return Object.keys(a) === Object.keys(b);
    }else{
      return false;
    }
  }
  let deepEqual = (a, b) => {
    if( isBasic(a) && isBasic(b) ){
      return a===b;
    }else if( isBasic(a) ^ isBasic(b) ) {
      return false;
    }else if( !lengthEqual(a,b) ){
      return false;
    }
    let equal = true;
    for(let i in a){
      equal = deepEqual(a[i],b[i]);
      if(!equal){
        break;
      }
    }
    return equal;
  };
  return deepEqual(one,another) ? eqResult : (neqResult===void 0 ?'':neqResult);
}
export default Ember.Helper.helper(eq)

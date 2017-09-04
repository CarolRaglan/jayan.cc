import moment from 'moment';
export let isBasic = (it) => {
  return it === null || ( typeof it !== 'object' && typeof it !== 'array' );
}

export let clone = function (it) {
  if (isBasic(it)) {
    return it;
  }
  let result = Array.isArray(it) ? [] : {};
  for (let i in it) {
    result[i] = clone(it[i]);
  }
  return result;
}

//获取某月的具体天数
let getDaysInMonth =  function ( date ) {
  let month = date.getMonth();
  date.setMonth(month + 1);
  date.setDate(0);
  return date.getDate();
};

//判断一段时间差是否是整月
let isMonthly=function(start,end,FORMAT){
  start = moment(start, FORMAT);
  end = moment(end, FORMAT);
  if(end.isBefore(start)){
    [start,end] = [end,start];
  }
  do{
    start = start.add(1,'month');
    if(end.isSame(start,'year') && end.isSame(start,'month') && end.isSame(start,'day')){
      return true;
    }
  }while(start.isBefore(end));
  return false;
};

export let getPeriod = function (start, end, FORMAT) {
  let result = [];
  start = moment(start, FORMAT);
  end = moment(end, FORMAT);
  let year = end.year() - start.year();
  let month = end.month() - start.month();
  let day = end.date() - start.date()+1;
  let dayInMonth = getDaysInMonth(start.toDate());
  let monthly = isMonthly(start,moment(end).add(1,'day'));
  if (year !== 0) {
    month += year * 12;
    year=0;
  }
  if(monthly){
    if(day>0){
      month++;
    }
    day = 0;
    return month+'月';
  }
  if (day < 0) {
    if(month==1){
      day += getDaysInMonth(start.toDate());
    }else{
      day += getDaysInMonth(end.toDate());
    }
    month--;
  }else if(day == dayInMonth){
    month++;
    day -= dayInMonth;
  }else if(day >= 30){
    month++;
    day=0;
  }
  if (month > 0) {
    result.push(month + '个月');
  }
  if (day > 0) {
    result.push(day + '天');
  }
  return (month>=0 && result.length) ? result.join('') : '?天';
};

export let getMathPeriod = function (start, end, FORMAT) {
  let negative = false;
  start = moment(start, FORMAT);
  end = moment(end, FORMAT);
  if(start.isAfter(end)){
    [start,end] = [end,start];
    negative = true;
  }
  let year = end.year() - start.year();
  let month = end.month() - start.month();
  let day = end.date() - start.date();
  let monthly = isMonthly(start,end);
  let dayInMonth = getDaysInMonth(start.toDate());
  if (year !== 0) {
    month += year * 12;
    year=0;
  }
  if(monthly){
    if(day>0){
      month++;
    }
    day = 0;
    return {negative,month,day};
  }
  if (day < 0) {
    if(month==1){
      day += getDaysInMonth(start.toDate());
    }else{
      day += getDaysInMonth(end.toDate());
    }
    month--;
  }else if(day == dayInMonth){
    month++;
    day -= dayInMonth;
  }else if(day >= 30){
    month++;
    day=0;
  }
  return {negative,month,day};
};

export let getGap = function (start,end,FORMAT) {
  start = moment(start, FORMAT);
  end = moment(end, FORMAT);
  let year = (end.year() - start.year());
  let month = (end.month() - start.month());
  let day = end.date() - start.date()+1;
  let dayInMonth = getDaysInMonth(start.toDate());
  let monthly = isMonthly(start,moment(end).add(1,'day'));
  if(monthly){
    if(day>0){
      month++;
    }
    day = 0;
  }
  if (day < 0) {
    if(month==1){
      day += getDaysInMonth(start.toDate());
    }else{
      day += getDaysInMonth(end.toDate());
    }
    month--;
  }else if(day == dayInMonth){
    month++;
    day -= dayInMonth;
  }else if(day >= 30){
    month++;
    day=0;
  }
  return {year,month,day};
};

let is = function (it,type) {
  return ({}).toString.call(it)===`[object ${type}]`;
};

export let isFunction = (it)=>{
  return is(it,'Function');
};


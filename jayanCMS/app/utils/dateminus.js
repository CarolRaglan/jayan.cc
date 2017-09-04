export default function dateminus(start,end) {
  let tmp,
    years = 0,
    months = 0,
    days = 0,
    _end_time = moment(end).format("YYYY-MM-DD");
  years = end.split("-")[0] - start.split("-")[0];
  for (var i = 1; i <= years + 1; i++) {
    tmp = moment(start).add(i, "years").subtract(1, "days").format("YYYY-MM-DD");
    if (tmp >= _end_time) {
      if (tmp == _end_time) {
        start = moment(start).add(i - 1, "years").subtract(1, "days").format("YYYY-MM-DD");
        years = i;
        break;
      } else {
        start = moment(start).add(i - 1, "years").format("YYYY-MM-DD");
      }

      years = i - 1;
      break;
    }

  };
  for (var j = 1; j <= 12; j++) {

    tmp = moment(start).add(j, "months").subtract(1, "days").format("YYYY-MM-DD");
    if (tmp >= _end_time) {
      if (tmp == _end_time) {


        if (tmp.indexOf("02-29") != -1 || tmp.indexOf("02-28") != -1) {
          start = moment(start).add(j - 1, "months").subtract(0, "days").format("YYYY-MM-DD");
          months = j - 1;

        } else {
          start = moment(start).add(j - 1, "months").subtract(1, "days").format("YYYY-MM-DD");
          months = j;
        }

        break;
      } else {
        start = moment(start).add(j - 1, "months").format("YYYY-MM-DD");
      }
      months = j - 1;
      break;
    }

  };

  for (var k = 1; k <= 31; k++) {
    tmp = moment(start).add(k, "days").subtract(1, "days").format("YYYY-MM-DD");

    if (_end_time.indexOf("02-27") != -1 ) {
      days = 0;
      break;
    }
    if (moment(tmp).add(1, "months").format("YYYY-MM-DD") == _end_time) {
      days = k - 1;
      break;
    } else if (tmp > _end_time) {
      days = k - 1;
      break;
    }
  };
  return years + " 年 " + months + " 月 " + days + " 天";
}

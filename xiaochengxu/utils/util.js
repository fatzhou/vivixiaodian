function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatTimeChinese(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return formatNumber(year)+'年'+formatNumber(month)+'月'+formatNumber(day)+'日 '+[hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getDateDiff(dateTimeStamp) {
  var result;
  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var halfamonth = day * 15;
  var month = day * 30;
  var now = new Date().getTime();
  var diffValue = now - dateTimeStamp;
  if (diffValue < 0) {
    return;
  }
  var monthC = diffValue / month;
  var weekC = diffValue / (7 * day);
  var dayC = diffValue / day;
  var hourC = diffValue / hour;
  var minC = diffValue / minute;
  if (monthC >= 1) {
    if (monthC <= 12)
      result = "" + parseInt(monthC) + "月前";
    else {
      result = "" + parseInt(monthC / 12) + "年前";
    }
  }
  else if (weekC >= 1) {
    result = "" + parseInt(weekC) + "周";
  }
  else if (dayC >= 1) {
    result = "" + parseInt(dayC) + "天";
  }
  else if (hourC >= 1) {
    result = "" + parseInt(hourC) + "小时";
  }
  else if (minC >= 1) {
    result = "" + parseInt(minC) + "分钟";
  } else {
    result = "" + (diffValue / 1000);
  }

  return result;
};

module.exports = {
  formatTime: formatTime,
  formatTimeChinese: formatTimeChinese,
  getDateDiff: getDateDiff
}

$(function(){
  $('.datepicker').datetimepicker({
    format: "YYYY/MM/DD",
    icons: {
      previous: "fa fa-arrow-left",
      next: "fa fa-arrow-right"
    }
  });
  $('.datetimepicker').datetimepicker({
    format: "YYYY/MM/DD HH:mm",
    icons: {
      time: "fa fa-clock-o",
      date: "fa fa-calendar",
      up: "fa fa-arrow-up",
      down: "fa fa-arrow-down",
      previous: "fa fa-arrow-left",
      next: "fa fa-arrow-right"
    }
  });
});

/**
 * 日付を加算する
 * @param  {Date}   date       日付
 * @param  {Number} num        加算数
 * @param  {String} [interval] 加算する単位
 * @return {Date}              加算後日付
 */
var addDate = function (date, num, interval) {
  var retDate = new Date(date.toString()); // dateが変更されないよう一度toStringする
  switch (interval) {
    case 'YYYY':
      retDate.setYear(1900 + date.getYear() + num);
      break;
    case 'MM':
      retDate.setMonth(date.getMonth() + num);
      break;
    case 'hh':
      retDate.setHours(date.getHours() + num);
      break;
    case 'mm':
      retDate.setMinutes(date.getMinutes() + num);
      break;
    case 'ss':
      retDate.setSeconds(date.getSeconds() + num);
      break;
    default:
      retDate.setDate(date.getDate() + num);
  }
  return retDate;
};

/**
 * 年・月・週の初日を取得する
 * @param  {String}  source_date 計算元日付 YYYY/MM/DD
 * @param  {String}  unit        単位(Y:年、M:月、W:週)
 * @param  {Boolean} prev_flg    過去フラグ(true:1(年・月・週)前の日付を取得 false:過去でない)
 * @return {String}
 */
var getFirstDate = function(source_date, unit, prev_flg) {

  var dt = new Date(source_date);
  switch(unit) {
    case "Y" :
      if (prev_flg) {
        dt = addDate(dt, -1, "YYYY");
      }
      return (dt.getFullYear() + "/01/01");
    case "M" :
      if (prev_flg) {
        dt = addDate(dt, -1, "MM");
      }
      return (dt.getFullYear() + "/" + ("0"+(dt.getMonth() + 1)).slice(-2) + "/01");
    case "W" :
      if (prev_flg) {
        dt.setDate(dt.getDate() - 7);
      }
      // source_dateから曜日の日数(日：0 月：1 … 土：6 …getDay()で取得)を引く
      dt.setDate(dt.getDate() - (dt.getDay())%7);
      return (dt.getFullYear() + "/" + ("0"+ (dt.getMonth() + 1)).slice(-2)
        + "/" + ("0"+ dt.getDate()).slice(-2));
    default :
      return "";
  }
}

/**
 * 年・月・週の最終日を取得する
 * @param  {String}  source_date 計算元日付 YYYY/MM/DD
 * @param  {String}  unit        単位(Y:年、M:月、W:週)
 * @return {String}
 */
var getLastDate = function(source_date, unit) {

  var dt = new Date(source_date);
  switch(unit) {
    case "Y" :
      // その年の12月31日
      return (dt.getFullYear() + "/12/31");
    case "M" :
      // 翌月初日の前日
    　dt.setDate(getFirstDate(new Date(addDate(dt, 1, "MM"))) -1)
      return (dt.getFullYear() + "/" + ("0"+(dt.getMonth() + 1)).slice(-2) + "/"
               + ("0" + dt.getDate()).slice(-2));
    case "W" :
      // source_dateから土曜までの日数(日：6 月：5 … 土：0 …6-getDay()で取得)を引く
      dt.setDate(dt.getDate() - (6-(dt.getDay())%7));
      return (dt.getFullYear() + "/" + ("0"+ (dt.getMonth() + 1)).slice(-2)
        + "/" + ("0"+ dt.getDate()).slice(-2));
    default :
      return "";
  }
}

/**
 * 日付をフォーマットする
 * @param  {Date}   date     日付
 * @param  {String} [format] フォーマット
 * @return {String}          フォーマット済み日付
 */
var formatDate = function (date, format) {
  if (!format) format = 'YYYY-MM-DD hh:mm:ss.SSS';
  format = format.replace(/YYYY/g, date.getFullYear());
  format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
  format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
  format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
  format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
  format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
  if (format.match(/S/g)) {
    var milliSeconds = ('00' + date.getMilliseconds()).slice(-3);
    var length = format.match(/S/g).length;
    for (var i = 0; i < length; i++) format = format.replace(/S/, milliSeconds.substring(i, i + 1));
  }
  return format;
}

var isReallyNaN = function (x) {
  return (x !== x);
}

var getWaintMsgHtml = function() {
  return '<div class="windows8"> \
<div class="wBall" id="wBall_1"> \
  <div class="wInnerBall"></div> \
</div> \
<div class="wBall" id="wBall_2"> \
  <div class="wInnerBall"></div> \
</div> \
<div class="wBall" id="wBall_3"> \
  <div class="wInnerBall"></div> \
</div> \
<div class="wBall" id="wBall_4"> \
  <div class="wInnerBall"></div> \
</div> \
<div class="wBall" id="wBall_5"> \
  <div class="wInnerBall"></div> \
</div> \
</div><div id="loading-msg"> \
処理中...</div>';
}

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
  switch (interval) {
    case 'YYYY':
      date.setYear(1900 + date.getYear() + num);
      break;
    case 'MM':
      date.setMonth(date.getMonth() + num);
      break;
    case 'hh':
      date.setHours(date.getHours() + num);
      break;
    case 'mm':
      date.setMinutes(date.getMinutes() + num);
      break;
    case 'ss':
      date.setSeconds(date.getSeconds() + num);
      break;
    default:
      date.setDate(date.getDate() + num);
  }
  return date;
};

/**
 * 年・月・週の初日を取得する
 * @param  {String}  source_date 計算元日付 YYYY/MM/DD
 * @param  {String}  unit        単位(Y:年、M:月、W:週)
 * @param  {Boolean} prev_flg    過去フラグ(true:1(年・月・週)前の日付を取得 false:過去でない)
 * @return {String}
 */
var getFirstDate = function(source_date, unit, prev_flg) {
  console.log(unit+"_getFirstDate()");

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
      dt.setDate(dt.getDate() - (dt.getDay()-1)%7);
      return (dt.getFullYear() + "/" + ("0"+ (dt.getMonth() + 1)).slice(-2)
        + "/" + ("0"+ dt.getDate()).slice(-2));
    default :
      return "";
  }
}

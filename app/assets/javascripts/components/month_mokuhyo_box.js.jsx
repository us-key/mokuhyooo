/*
 * 月単位の親component
 * Props:source_date:算出元日付
 * State:target_date:source_dateを元に算出した日付(月の初日)
 *       base_target_date:変更前のtarget_date。source_date変更時の
 *                        target_date変更判別用。
 *       prev_date:prev_month用の日付
 */
var MonthMokuhyoBox = React.createClass({
  /*
   * dataの初期化(空配列)
   * target_date,base_target_dateにprops.source_dateをセット
   */
  getInitialState() {
    console.log("[M]getInitialState()");
    return {
      data: [],
      target_date: this.props.source_date,
      base_target_date:this.props.source_date
    };
  },
  /*
   * source_dateを元にtarget_date算出(本来外だしか)
   */
  componentWillMount() {
    console.log("[M]componentWillMount()");
    // TODO 本来はここじゃない
    // 月の初日
    var dt = new Date(this.props.source_date);
    this.state.target_date = dt.getFullYear() + "/" + ("0"+(dt.getMonth() + 1)).slice(-2)
      + "/01";
    console.log(this.state.target_date);
    var prev_dt = addDate(new Date(this.state.target_date), -1, 'MM');
    this.state.prev_date = prev_dt.getFullYear() + "/" + ("0" + (prev_dt.getMonth() + 1)).slice(-2)
      + "/01";
    console.log(this.state.prev_date);
    // TODO 本来はここじゃない おわり
  },
  componentWillReceiveProps() {
    console.log("[M]componentWillReceiveProps()");
    // 月の初日
    var dt = new Date(source_date);
    this.state.target_date = dt.getFullYear() + "/" + (dt.getFullMonth() + 1)
      + "/01";
    console.log(this.state.target_date);
  },
  render() {
    console.log("[M]render()");
    return(
      <div className="monthMokuhyoBox">
        <PrevMonthReview target_date={this.state.prev_date} url={this.props.url}/>
        <ThisMonthMokuhyo target_date={this.state.target_date}/>
        <ThisMonthReview target_date={this.state.target_date}/>
      </div>
    );
  }
});

var PrevMonthReview = React.createClass({
  getInitialState() {
    console.log("[M_PR]getInitialState()");
    return {
      com_id:"",
      comment:""
    };
  },
  componentDidMount() {
    console.log("[M_PR]componentDidMount()");
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      data: {
        record_date: this.props.target_date,
        target_unit: 'M',
        target_review_type: 'R'
      },
      success: function(result) {
        console.log("id:" + result.id);
        console.log("comment:" + result.comment);
        this.setState({
          com_id: result.id,
          comment: result.comment
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  onChangeText(e) {
    this.setState({comment: e.target.value});
  },
  render() {
    console.log("[M_PR]render()");
    return(
      <div className="panel panel-warning">

        <div className="panel-heading">
          <a data-toggle="collapse" href=".prevMonthR">先月の振り返り</a>
          <a href="#"><span className="glyphicon glyphicon-pencil" aria-hidden="true"/></a>
        </div>
        <div className="prevMonthR panel collapse">
          <textarea id={this.state.com_id}
                    className="form-control prevMonthReviewInput"
                    value={this.state.comment}
                    onChange={this.onChangeText}>
          </textarea>
        </div>
      </div>
    );
  }
});
var ThisMonthMokuhyo = React.createClass({
  render() {
    return(
      <div className="panel panel-warning">
        <div className="panel-heading">
          <a data-toggle="collapse" href=".thisMonth">今月の目標</a> <a href="#"><span className="glyphicon glyphicon-pencil" aria-hidden="true"/></a>
        </div>
        <div className="thisMonthM panel collapse">
          <textarea className="form-control thisMonthMokuhyoInput"/>
        </div>
      </div>
    );
  }
});
var ThisMonthReview = React.createClass({
  render() {
    return(
      <div className="panel panel-success">
        <div className="panel-heading">
          <a data-toggle="collapse" href=".thisMonthRev">今月の振り返り</a> <a href="#"><span className="glyphicon glyphicon-pencil" aria-hidden="true"/></a>
        </div>
        <div className="thisMonthR panel collapse">
          <textarea className="form-control thisMonthReviewsInput"/>
        </div>
      </div>
    )
  }
})

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
      date.setYear(date.getYear() + num);
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

/*
 * Freewordの親component
 * Props:source_date:算出元日付
 * State:target_date:source_dateを元に算出した日付(年or月or週の初日)
 *       base_target_date:変更前のtarget_date。source_date変更時の
 *                        target_date変更判別用。
 *       prev_date:prev_month用の日付
 */
var FreewordParentBox = React.createClass({
  /*
   * dataの初期化(空配列)
   * target_date,base_target_dateにprops.source_dateをセット
   */
  getInitialState() {
    console.log(this.props.unit+"_getInitialState()");
    return {
      data: [],
      target_date: this.props.source_date,
      base_target_date:this.props.source_date,
      pr_prefix: this.props.unit + "_PR",
      t_prefix: this.props.unit + "_T",
      r_prefix: this.props.unit + "_R"
    };
  },
  /*
   * source_dateを元にtarget_date算出(本来外だしか)
   */
  componentWillMount() {
    console.log(this.props.unit+"_componentWillMount()");
    // TODO 本来はここじゃない気がする
    // 初日
    var dt = new Date(this.props.source_date);
    var prev_dt = dt;
    switch(this.props.unit) {
      case "Y" :
        this.state.target_date = dt.getFullYear() + "/01/01";
        prev_dt = addDate(prev_dt, -1, "YYYY");
        this.state.prev_date = prev_dt.getFullYear() + "/01/01";
        break;
      case "M" :
        this.state.target_date = dt.getFullYear() + "/" + ("0"+(dt.getMonth() + 1)).slice(-2)
          + "/01";
        prev_dt = addDate(prev_dt, -1, "MM");
        this.state.prev_date = prev_dt.getFullYear() + "/" + ("0"+(prev_dt.getMonth() + 1)).slice(-2)
          + "/01";
        break;
      case "W" :
        // source_dateから曜日の日数(日：0 月：1 … 土：6 …getDay()で取得)を引く
        dt.setDate(dt.getDate() - dt.getDay());
        this.state.target_date = dt.getFullYear() + "/" + ("0"+ (dt.getMonth() + 1)).slice(-2)
          + "/" + ("0"+ dt.getDate()).slice(-2);
        prev_dt.setDate(prev_dt.getDate() - (7 + prev_dt.getDay()));
        this.state.prev_date = prev_dt.getFullYear() + "/" + ("0"+ (prev_dt.getMonth() + 1)).slice(-2)
          + "/" +  ("0"+ prev_dt.getDate()).slice(-2);
        break;
      default : ;
    }
    console.log(this.state.target_date);
    console.log(this.state.prev_date);
    // TODO 本来はここじゃない おわり
  },
  render() {
    console.log("[M]render()");
    return(
      <div className="monthMokuhyoBox">
        <FreeWordBox
          unit={this.props.unit}
          type="R"
          target="prev"
          target_date={this.state.prev_date}
          url={this.props.url}
          prefix={this.state.pr_prefix}
        />
        <FreeWordBox
          unit={this.props.unit}
          type="T"
          target="this"
          target_date={this.state.target_date}
          url={this.props.url}
          prefix={this.state.t_prefix}
        />
        <FreeWordBox
          unit={this.props.unit}
          type="R"
          target="this"
          target_date={this.state.target_date}
          url={this.props.url}
          prefix={this.state.r_prefix}
        />
      </div>
    );
  }
});

var FreeWordBox = React.createClass({
  getInitialState() {
    console.log(this.props.prefix+"_getInitialState()");
    return {
      com_id:"",
      comment:""
    };
  },
  componentDidMount() {
    console.log(this.props.prefix+"_componentDidMount()");
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      data: {
        record_date: this.props.target_date,
        target_unit: this.props.unit,
        target_review_type: this.props.type
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
    console.log(this.props.prefix+"_onChangeText()");
    this.setState({comment: e.target.value});
  },
  onClick(e, com_id, comment) {
    e.preventDefault();
    console.log(this.props.prefix+"_onClick()");
    console.log("id:"+com_id);
    console.log("comment:"+comment);
    $.ajax({
      url: this.props.url,
      type: 'POST',
      dataType: 'json',
      data: {
        'id': com_id,
        'comment': comment,
        'target_unit': this.props.unit,
        'target_review_type': this.props.type,
        'record_date': this.props.target_date
      },
      success: function(result) {
        console.log(this.props.prefix+"_Result" + result.message);
        // 過去のメッセージが再表示されないように一旦すべて消す
        $('.register_msg').text("");
        $('.register_msg').show();
        this.setState({
          message: result.message
        });
        $('.register_msg').delay(1500).fadeOut(500);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render() {
    console.log(this.props.prefix+"_render()");
    const toggleTarget = "." + this.props.prefix + "_panel";
    const panelClass = this.props.prefix + "_panel panel collapse";
    var panelTitle = "";
    switch(this.props.target) {
      case "this" : panelTitle += "今"; break;
      case "prev" : panelTitle += "前"; break;
      default : ;
    }
    switch(this.props.unit) {
      case "Y" : panelTitle += "年"; break;
      case "M" : panelTitle += "月"; break;
      case "W" : panelTitle += "週"; break;
      default : ;
    }
    panelTitle += "の";
    switch(this.props.type) {
      case "T" : panelTitle += "目標"; break;
      case "R" : panelTitle += "振り返り"; break;
      default : ;
    }
    return(
      <div className="panel panel-warning">
        <div className="panel-heading">
          <a data-toggle="collapse" href={toggleTarget}>{panelTitle}</a>
          <a href="#"><span className="glyphicon glyphicon-pencil" aria-hidden="true"/></a>
          <a href="#"><span id='register' onClick={e => this.onClick(e, this.state.com_id, this.state.comment)}>登録</span></a>
          <span className="register_msg">{this.state.message}</span>
        </div>
        <div className={panelClass}>
          <textarea id={this.state.com_id}
                    className="form-control prevMonthReviewInput"
                    value={this.state.comment}
                    onChange={this.onChangeText}
                    >
          </textarea>
        </div>
      </div>
    );
  }
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

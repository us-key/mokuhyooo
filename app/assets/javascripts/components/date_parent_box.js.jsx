/*
 * DateBoxの親component
 * props.source_dateを元に一週間分の日付を取得し、
 * それぞれの日付で子componentを用意する
 * props.source_dateを元に算出した週の初日(state.target_date)が
 * 変わらない場合、再描画しない(子componentも)
 */
var DateParentBox = React.createClass({
  getInitialState() {
    return {
      dateArr: [], // 週表示の日付格納用配列
      items: {},
      msg: "",
      year: "", // 月別表示の対象年
      yearlyMonthArr: {},
      yearlyMonthDateArr: {}, // 月毎の日付配列を年月をキーに格納する連想配列
      yearlyMonthDispArr: {}, // 月毎の日別明細表示有無を年月をキーに格納する連想配列
      qty_target_data: {
        mode: "",
        name: "",
        target_type: "SUM",
        quantity_kind: "QU",
        default_zero_flg: false,
        decimal_flg: false,
        sort_order: "",
        start_date: "",
        end_date: "",
        target_qty: "",
        target_hour: "",
        target_min: "",
        created_at: ""
      }
    };
  },
  componentWillMount() {
    this.getDate(this.getTargetDate(this.props.source_date));
    this.getYearlyMonthDate(getFirstDate(this.props.source_date, "Y", false))
    this.getTargetItem();
  },
  componentWillReceiveProps(nextProps) {
    this.getDate(this.getTargetDate(nextProps.source_date));
  },
  shouldComponentUpdate(nextProps, nextState) {
    // 週が変わった場合、rerender(componentWillReceicePropsで取得した週の日付で再描画)
    if (this.getTargetDate(this.props.source_date)
        !== this.getTargetDate(nextProps.source_date)) {
      return true;
    } else if (this.state != nextState) {
      // stateが更新された場合rerender
      // [想定]
      // 1. 数値目標のヘッダーが更新された場合
      // 2. メッセージの表示
      // 3. モーダルダイアログの入力
      console.log("rerender")
      return true;
    } else {
      return false;
    }
  },
  getTargetDate(sourceDate) {
    // 週の初日を得る
    return getFirstDate(sourceDate, "W", false);
  },
  // 週の初日を元に1週間の日付を算出し配列に詰める
  getDate(firstDay) {
    var dt = new Date(firstDay);
    // 日付をキー、データの連想配列を要素とした連想配列(1件ずつ配列に詰める)
    // 作成した連想配列を詰める配列
    var dateArr = [];
    // ajaxで目標・振り返り取得用の配列;
    for (var i = 0; i < 7; i++) {
      var dtKey = dt.getFullYear() + "/" + ("0" + (dt.getMonth() + 1)).slice(-2)
                  + "/" + ("0" + dt.getDate()).slice(-2);
      // 後でレコードとセットの配列に詰めるために配列にセットしておく
      dateArr.push(dtKey);
      dt.setDate(dt.getDate() + 1);
    }
    this.setState({dateArr : dateArr});
  },
  // 1年12か月分の月を配列にセットする
  getYearlyMonthDate(firstDay) {
    var year = firstDay.split("/",1)[0];
    var yearlyMonthArr = {};
    for (i = 1; i <= 12; i++) {
      yearlyMonthArr[i] = year + "/" + ("0" + i.toString()).slice(-2);
    }
    this.setState({
      year: year,
      yearlyMonthArr: yearlyMonthArr
    });
  },
  // 対象月1か月分の日付を算出し配列に詰める
  // targetYearMonth:YYYY/MM
  getMonthlyDateArr(e, targetYearMonth) {
    e.preventDefault;
    console.log("getMonthlyDateArr:" + targetYearMonth);
    var newVal = this.state.yearlyMonthDateArr;
    var newDispVal = this.state.yearlyMonthDispArr;

    if (typeof newDispVal[targetYearMonth] === "undefined") {
      newDispVal[targetYearMonth] = true;
    } else {
      newDispVal[targetYearMonth] = !newDispVal[targetYearMonth];
    }

    var monthlyDateArr = [];
    if ([] == newVal[targetYearMonth]
    || typeof newVal[targetYearMonth] === "undefined") {
      var dt = new Date(targetYearMonth + "/01");
      var month = dt.getMonth() + 1;
      while (month === dt.getMonth() + 1) {
        var dtVal = targetYearMonth + "/" + ("0" + dt.getDate()).slice(-2);
        monthlyDateArr.push(dtVal);
        dt.setDate(dt.getDate() + 1);
      }
      newVal[targetYearMonth] = monthlyDateArr;

      this.setState({
        yearlyMonthDateArr: newVal,
        yearlyMonthDispArr: newDispVal
      });
    } else {
      this.setState({
        yearlyMonthDispArr: newDispVal
      })
    }
  },
  // ユーザーごとの数値目標項目を取得する
  getTargetItem() {
    itemsArr = {};
    // ajaxで数値目標のリストを取得
    // 形式
    // {
    //   "2": {"qt_id": xx, "name": xx, "type": xx, "kind": xx, "zero_flg": xx, "deimal_flg": xx},
    //   "3": {…} // keyは数値目標のソート順
    // }
    $.ajax({
      url: '/api/v1/date_target_headers.json',
      dataType: 'json',
      success: function(result) {
        this.setState({
          items: result
        });
      }.bind(this)
    });
  },
  showMsg(message) {
    this.setState({
      msg: message
    });
    // メッセージ表示して2秒後に消す
    $('.date_msg').show();
    $('.date_msg').delay(1500).fadeOut(500);
    var clearMsg = setInterval(function() {
      this.setState({
        message: ""
      });
      clearInterval(clearMsg);
    }.bind(this), 2000);
  },
  showModal(e,key) {
    e.preventDefault;
    if (key) {
      // ヘッダーの属性を取得する
      $.ajax({
        url: '/api/v1/date_target_headers_get.json',
        dataType: 'json',
        data: {
          'sort_order': key
        },
        async: false,
        success: function(result) {
          this.setState({
            qty_target_data: {
              mode: "U",
              name: result.name,
              target_type: result.target_type,
              quantity_kind: result.quantity_kind,
              default_zero_flg: (result.default_zero_flg==1),
              decimal_flg: (result.decimal_flg==1),
              sort_order: key,
              start_date: result.start_date ? result.start_date.replace(/-/g, '/') : formatDate(new Date(), 'YYYY/MM/DD'),
              end_date: result.end_date ? result.end_date.replace(/-/g, '/') : getLastDate(this.props.source_date, "Y"),
              target_qty: (result.quantity_kind == 'QU') ? result.target_value : "",
              target_hour: (result.quantity_kind != 'QU') ? parseInt(result.target_value)/60|0 : "",
              target_min: (result.quantity_kind != 'QU') ? parseInt(result.target_value)%60 : "",
              created_at: result.created_at.substring(0,10).replace(/-/g, '/')
            }
          });
        }.bind(this)
      });
    } else {
      // 初期化
      this.setState({
        qty_target_data: {
          mode: "C",
          name: "",
          target_type: "SUM",
          quantity_kind: "QU",
          default_zero_flg: "",
          decimal_flg: "",
          sort_order: "",
          start_date: formatDate(new Date(), 'YYYY/MM/DD'),
          end_date: getLastDate(this.props.source_date, "Y"),
          target_qty: "",
          target_hour: "",
          target_min: "",
          created_at: ""
        }
      });
    }
    $('#dateTargetModal').modal();
  },
  showMonthlyDisplayModal(e,key) {
    e.preventDefault;
    if (key) {
    } else {
    }
    $('#monthlyDisplayModal').modal();
  },
  handleSubmit() {
    $.ajax({
      url: 'api/v1/date_target_headers.json',
      type: 'POST',
      dataType: 'json',
      data: {
        'mode': this.state.qty_target_data.mode,
        'name': this.state.qty_target_data.name,
        'target_type': this.state.qty_target_data.target_type,
        'quantity_kind': this.state.qty_target_data.quantity_kind,
        // チェックボックスのbooleanから0/1に置換
        'default_zero_flg': this.state.qty_target_data.default_zero_flg ? "1" : "0",
        'decimal_flg': this.state.qty_target_data.decimal_flg ? "1" : "0",
        'start_date': this.state.qty_target_data.start_date,
        'end_date': this.state.qty_target_data.end_date,
        'sort_order': this.state.qty_target_data.sort_order,
        'target_value':
            (this.state.qty_target_data.quantity_kind == 'QU')
            ? this.state.qty_target_data.target_qty
            : parseInt(this.state.qty_target_data.target_hour) * 60 + parseInt(this.state.qty_target_data.target_min)
      },
      success: function(result) {
        $('#dateTargetModal').modal('hide');
        // ヘッダーの再取得
        this.getTargetItem();
      }.bind(this)
    });
  },
  render() {
    var url = this.props.url;
    var items = this.state.items;
    var dateNode = this.state.dateArr.map(function(data) {
      return (
        <DateChildBox
          url={url}
          target_date={data}
          items={items}
          showMsg={this.showMsg}
          disp={true}
          selected_date_flg={data==this.props.source_date}
        />
      )
    }.bind(this));

    var itemNum = Object.keys(this.state.items).length;
    itemsArr = this.state.items;
    var header = Object.keys(this.state.items).map(function(key, idx) {
      var type_label = "";
      switch(itemsArr[key]["type"]) {
        case "SUM" : type_label = "合計"; break;
        case "AVE" : type_label = "平均"; break;
      }
      return (
        <th id={itemsArr[key]["qt_id"]} className="qtyCol"><a onClick={(e) => this.showModal(e,key)}>{itemsArr[key]["name"]}<br/>({type_label})</a></th>
      )
    }.bind(this));
    var style = {
      width: itemNum*80 + "px"
    };
    var quTargetInput =
      <input className="form-control"
             type="number"
             style={{"width":"50px","display":"inline"}}
             value={this.state.qty_target_data.target_qty}
             step="1"
             onChange={(e) => {
               var newState = this.state;
               var newVal = e.target.value;
               newState.qty_target_data.target_qty = newVal;
               this.setState(newState);
             }}/>
    ;
    var tiTdTargetInput =
      <div>
      <input className="form-control"
             type="number"
             style={{"width":"25px","display":"inline"}}
             value={this.state.qty_target_data.target_hour}
             onChange={(e) => {
               var newState = this.state;
               newState.qty_target_data.target_hour = e.target.value;
               this.setState(newState);
             }}/>
      ：
      <input className="form-control"
             type="number"
             style={{"width":"25px","display":"inline"}}
             value={this.state.qty_target_data.target_min}
             onChange={(e) => {
               var newState = this.state;
               newState.qty_target_data.target_min = e.target.value;
               this.setState(newState);
             }}/>
      </div>
    ;
    // 月単位のレコード＋サマリ行
    var monthlyListItems = Object.keys(this.state.yearlyMonthArr).map(function(key, idx) {
      var yearMonth = this.state.yearlyMonthArr[key];
      var disp = this.state.yearlyMonthDispArr[yearMonth];
      // 月別の日毎の
      var monthlyDateNode =
        this.state.yearlyMonthDateArr[yearMonth] ?
        this.state.yearlyMonthDateArr[yearMonth].map(function(data) {
          return (
            <DateChildBox
              url={url}
              target_date={data}
              items={items}
              showMsg={this.showMsg}
              disp={disp}
            />
          );
        })
        :
        <span></span>
      return (
        <tbody>
          {monthlyDateNode}
          <DateSummaryBox
            onEventCallBack = {this.getMonthlyDateArr}
            target_date = {yearMonth + "/" + "01"}
            items = {this.state.items}
            unit = "M"
        />
        </tbody>
      );
    }.bind(this));
    // 月別表示ダイアログ
    var monthlyListDialog =
      <div className="modal fade" id="monthlyDisplayModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal"><span>×</span></button>
              <h4 className="modal-title">月別表示 : {this.state.year}年</h4>
            </div>
            <div className="modal-body">

              <div className="panel table-responsive">
                <table className="table table-condensed table-hover table-striped sticky-table">
                  <thead>
                  {// 固定列の日付・目標・振り返りプラス、登録した分の数値目標
                  }
                    <tr>
                      {// 固定列
                      }
                      <th rowSpan="2" className="btnCol">日付</th>
                      <th rowSpan="2" className="commentCol">目標</th>
                      <th rowSpan="2" className="commentCol">振返り</th>
                      {// 数値目標列ヘッダ・数値目標数だけrowSpan設定
                      }
                      <th colSpan={itemNum} style={style}>数値目標
                      </th>
                    </tr>
                    <tr>
                    {header}
                    </tr>
                  </thead>
                  {// 目標の進捗表示行。週・月・年
                  }
                  {monthlyListItems}
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    ;
    // 数値目標登録ダイアログ
    var qtyTargetRegisterDialog =
      <div className="modal fade" id="dateTargetModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal"><span>×</span></button>
              <h4 className="modal-title">数値目標登録</h4>
            </div>
            <div className="modal-body">
              <form action="javascript:void(0)" onSubmit={this.handleSubmit} className="form-horizontal">
                <div className="form-group">
                  <label className="col-sm-2 control-label" htmlFor="name">名前：</label>
                  <div className="col-sm-10">
                    <input className="form-control" type="text" name="name" value={this.state.qty_target_data.name}
                         onChange={(e) => {
                           var newState = this.state;
                           newState.qty_target_data.name = e.target.value;
                           this.setState(newState);
                         }}
                         required/>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label" htmlFor="target_type">集計方法：</label>
                  <div className="col-sm-10" style={{"verticalAlign": "middle","paddingTop": "7px"}}>
                    <label>合計</label>
                    <input type="radio" name="target_type" value="SUM"
                           checked={this.state.qty_target_data.target_type === "SUM"}
                           onChange={() => {
                             var newState = this.state;
                             newState.qty_target_data.target_type = "SUM";
                             newState.qty_target_data.default_zero_flg = false;
                             this.setState(newState);
                           }}/>
                    <label>平均</label>
                    <input type="radio" name="target_type" value="AVE"
                           checked={this.state.qty_target_data.target_type === "AVE"}
                           onChange={() => {
                             var newState = this.state;
                             newState.qty_target_data.target_type = "AVE";
                             this.setState(newState);
                         }}/>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label" htmlFor="quantity_kind">数値種類：</label>
                  <div className="col-sm-10" style={{"verticalAlign": "middle","paddingTop": "7px"}}>
                    <label>数量</label>
                    <input type="radio" name="quantity_kind" value="QU"
                           checked={this.state.qty_target_data.quantity_kind === "QU"}
                           disabled={this.state.qty_target_data.mode === "U"}
                           onChange={() => {
                             var newState = this.state;
                             newState.qty_target_data.quantity_kind = "QU";
                             this.setState(newState);
                           }}/>
                    <label>時間</label>
                    <input type="radio" name="quantity_kind" value="TI"
                           checked={this.state.qty_target_data.quantity_kind === "TI"}
                           disabled={this.state.qty_target_data.mode === "U"}
                           onChange={() => {
                             var newState = this.state;
                             newState.qty_target_data.quantity_kind = "TI";
                             this.setState(newState);
                           }}/>
                    <label>時刻</label>
                    <input type="radio" name="quantity_kind" value="TD"
                           checked={this.state.qty_target_data.quantity_kind === "TD"}
                           disabled={this.state.qty_target_data.mode === "U"}
                           onChange={() => {
                             var newState = this.state;
                             newState.qty_target_data.quantity_kind = "TD";
                             this.setState(newState);
                           }}/>
                  </div>
                </div>
                <div className="form-group">
                  <div className="col-sm-offset-2 col-sm-10" style={{"verticalAlign": "middle","paddingTop": "7px"}}>
                    <div className="checkbox"
                         style={{
                           "display": (this.state.qty_target_data.target_type == "SUM") ? "none" : ""
                         }}
                         >
                      <label>
                        <input type="checkbox"
                               checked={this.state.qty_target_data.default_zero_flg}
                               onChange={() => {
                                 var newState = this.state;
                                 // フラグを反転させる
                                 newState.qty_target_data.default_zero_flg = !newState.qty_target_data.default_zero_flg;
                                 this.setState(newState);
                               }}/>
                        未入力をゼロとみなす
                      </label>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <div className="col-sm-offset-2 col-sm-10" style={{"verticalAlign": "middle","paddingTop": "7px"}}>
                    <div className="checkbox">
                      <label>
                        <input type="checkbox"
                               checked={this.state.qty_target_data.decimal_flg}
                               onChange={() => {
                                 var newState = this.state;
                                 // フラグを反転させる
                                 newState.qty_target_data.decimal_flg = !newState.qty_target_data.decimal_flg;
                                 this.setState(newState);
                               }}/>
                        小数点以下入力
                      </label>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">１日あたり：</label>
                  <div className="col-sm-10">
                    {(this.state.qty_target_data.quantity_kind === "QU") ?
                      quTargetInput
                      :
                      tiTdTargetInput
                    }
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label" htmlFor="name">期間：</label>
                  <div className="col-sm-10">
                    <input className="form-control datepicker"
                           type="text"
                           style={{"width":"70px","display":"inline"}}
                           value={this.state.qty_target_data.start_date}
                           onBlur={(e) => {
                             console.log("onBlur:" + e.target.value);
                             var newState = this.state;
                             newState.qty_target_data.start_date = e.target.value;
                             this.setState(newState);
                           }}/>
                    ～
                    <input className="form-control datepicker"
                           type="text"
                           style={{"width":"70px","display":"inline"}}
                           value={this.state.qty_target_data.end_date}
                           readOnly
                           onBlur={(e) => {
                             console.log("onBlur:" + e.target.value);
                             var newState = this.state;
                             newState.qty_target_data.end_date = e.target.value;
                             this.setState(newState);
                           }}/>
                  </div>
                </div>
                <div>作成日：{this.state.qty_target_data.created_at}</div>
                <button type="submit" className="btn btn-default">登録</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    ;
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="panel panel-default">
            <div className="panel-heading">日毎 <span className="date_msg"> {this.state.msg} </span></div>
            <div className="panel table-responsive">
              <table className="table table-condensed table-hover table-striped sticky-table">
                <thead>
                {// 固定列の日付・目標・振り返りプラス、登録した分の数値目標
                }
                  <tr>
                    {// 固定列
                    }
                    <th rowSpan="2" className="btnCol">日付</th>
                    <th rowSpan="2" className="commentCol">目標</th>
                    <th rowSpan="2" className="commentCol">振返り</th>
                    {// 数値目標列ヘッダ・数値目標数だけrowSpan設定
                    }
                    <th colSpan={itemNum} style={style}>数値目標
                      <a onClick={(e)=> this.showModal(e,null)}>
                        [追加]
                        {//<span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
                        }
                      </a>
                      <a onClick={(e)=> this.showMonthlyDisplayModal(e,null)}>
                        [月毎表示]
                      </a>
                    </th>
                  </tr>
                  <tr>
                  {header}
                  </tr>
                </thead>
                <tbody>
                  {// 1週間分の行数用意。月曜～日曜
                  }
                  {dateNode}
                  {// TODO 目標の進捗表示行。週・月・年
                  }
                  <DateSummaryBox
                    target_date = {getFirstDate(this.props.source_date, "W", false)}
                    items = {this.state.items}
                    unit = "W"
                  />
                  <DateSummaryBox
                    target_date = {getFirstDate(this.props.source_date, "M", false)}
                    items = {this.state.items}
                    unit = "M"
                  />
                  <DateSummaryBox
                    target_date = {getFirstDate(this.props.source_date, "Y", false)}
                    items = {this.state.items}
                    unit = "Y"
                  />
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {// 数値目標入力モーダルダイアログ
        }
        {qtyTargetRegisterDialog}
        {// 数値目標入力モーダルダイアログおわり
        }
        {// 月毎表示モーダルダイアログ
        }
        {monthlyListDialog}
        {// 月毎表示モーダルダイアログおわり
        }
      </div>
    );
  }
});

/*
 * DateBoxの親component
 * props.source_dateを元に一週間分の日付を取得し、
 * それぞれの日付で子componentを用意する
 * props.source_dateを元に算出した週の初日(state.target_date)が
 * 変わらない場合、再描画しない(子componentも)
 */
var DateParentBox = React.createClass({
  getInitialState() {
    console.log("date_getInitialState()");
    return {
      dateArr: [],
      items: {}
    };
  },
  componentWillMount() {
    console.log("date_componentWillMount()");
    this.getDate(this.getTargetDate(this.props.source_date));
    this.getTargetItem();
  },
  componentWillReceiveProps(nextProps) {
    console.log("date_componentWillReceiveProps()");
    this.getDate(this.getTargetDate(nextProps.source_date));
  },
  shouldComponentUpdate(nextProps, nextState) {
    console.log("date_shouldComponentUpdate()");
    // 週が変わった場合、rerender(componentWillReceicePropsで取得した週の日付で再描画)
    if (this.getTargetDate(this.props.source_date)
        !== this.getTargetDate(nextProps.source_date)) {
      console.log("date:再描画");
      return true;
    } else {
      console.log("date:何もしない");
      return false;
    }
  },
  getTargetDate(sourceDate) {
    console.log("date_getTargetDate()");
    // 週の初日を得る
    return getFirstDate(sourceDate, "W", false);
  },
  // 週の初日を元に1週間の日付を算出し配列に詰める
  getDate(firstDay) {
    console.log("date_getDateValue()");
    console.log("target_date:" + firstDay);
    var dt = new Date(firstDay);
    // 日付をキー、データの連想配列を要素とした連想配列(1件ずつ配列に詰める)
//    var data = {};
    // 作成した連想配列を詰める配列
    var dateArr = [];
    // ajaxで目標・振り返り取得用の配列;
//    let typeArr = ['T', 'R'];
//    var jqXHRList = [];
    for (var i = 0; i < 7; i++) {
      var dtKey = dt.getFullYear() + "/" + ("0" + (dt.getMonth() + 1)).slice(-2)
                  + "/" + ("0" + dt.getDate()).slice(-2);
      // 後でレコードとセットの配列に詰めるために配列にセットしておく
      dateArr.push(dtKey);
      console.log("dateArr.push:" + dtKey);
      dt.setDate(dt.getDate() + 1);
    }
    this.setState({dateArr : dateArr});
  },
  // ユーザーごとの数値目標項目を取得する
  getTargetItem() {
    console.log("date_getTargetITem()");
    itemsArr = {};
    // TODO 試しに入れてみる
    itemsArr[1] = {"name":"勉強時間","type":"SUM","kind":"TI","flg":"1"};
    itemsArr[2] = {"name":"テスト","type":"SUM","kind":"TI","flg":"1"};
    // TODO ajaxで数値目標のリストを取得
    /*
      [SAMPLE]
       items: {
                1:{"name":"勉強時間","type":"SUM","kind":"TI","flg":"1"},
                2:{"name":"テスト","type":"SUM","kind":"TI","flg":"1"},
                …
              }
     */
    // setState
    this.setState({items : itemsArr})
  },
  render () {
    console.log("date_render()");
    console.log(this.state.dateArr.length);
    var url = this.props.url;
    var items = this.state.items;
    var dateNode = this.state.dateArr.map(function(data) {
      return (
        <DateChildBox
          url={url}
          target_date={data}
          items={items}
        />
      )
    });
    var itemNum = Object.keys(this.state.items).length;
    itemsArr = this.state.items;
    var header = Object.keys(this.state.items).map(function(key, idx) {
      return (
        <th>{itemsArr[key]["name"]}</th>
      )
    })
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="panel panel-default">
            <div className="panel-heading">日毎</div>
            <div className="panel">
              <table>
                <thead>
                {// 固定列の日付・目標・振り返りプラス、登録した分の数値目標
                }
                  <tr>
                    {// 固定列
                    }
                    <th rowSpan="2"></th>
                    <th rowSpan="2">日付</th>
                    <th rowSpan="2">目標</th>
                    <th rowSpan="2">振返り</th>
                    {// 数値目標列ヘッダ・数値目標数だけrowSpan設定
                    }
                    <th colSpan={itemNum}>数値目標<a href="#">目標を追加する</a></th>
                  </tr>
                  <tr>
                  {header}
                  </tr>
                </thead>
                <tbody>
                  {// 1週間分の行数用意。日曜～土曜？
                  }
                  {dateNode}
                  {// 目標の進捗表示行。週・月・年
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

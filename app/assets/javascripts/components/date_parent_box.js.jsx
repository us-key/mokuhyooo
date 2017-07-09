/*
 * DateBoxの親component
 * props.source_dateを元に一週間分の日付を取得し、
 * それぞれの日付で子componentを用意する
 * props.source_dateを元に算出した週の初日(state.target_date)が
 * 変わらない場合、再描画しない(子componentも)
 */
var DateParentBox = React.createClass({
  componentWillMount() {
    console.log("date_componentWillMount()");
    this.setState({target_date: this.getTargetDate(this.props.source_date)});
  },
  shouldComponentUpdate(nextProps, nextState) {
    console.log("date_componentWillReceiveProps()");
    // props.source_dateを元に算出した週の初日が変わらない場合、
    // 再描画しない
    if (this.getTargetDate(this.props.source_date)
        === this.getTargetDate(nextProps.source_date)) {
      return false;
    }
    this.setState({target_date: this.getTargetDate(nextProps.source_date)});
    return true;
  },
  getTargetDate(sourceDate) {
    console.log("date_getTargetDate()");
    // 週の初日を得る
    return getFirstDate(sourceDate, "W", false);
  },
  get7DaysOfWeek(firstDay) {
    var dt = new Date(firstDay);
    var daysOfWeek = [];
    for (var i = 0; i < 7; i++) {
      daysOfWeek.push(dt.getFullYear() + "/" + ("0" + (dt.getMonth() + 1)).slice(-2)
        + "/" + ("0" + dt.getDate()).slice(-2));
      dt.setDate(dt.getDate()+1);
    }
    return daysOfWeek;
  },
  render () {
    console.log("date_render()");
    var daysOfWeek = this.get7DaysOfWeek(this.state.target_date);
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="panel panel-default">
            <div className="panel-heading">日毎</div>
            {// TODO あとでreact化
            }
            <div className="panel">
              <table>
                <thead>
                  {// 固定列の日付・目標・振り返りプラス、登録した分の数値目標
                  }
                  <tr>
                    {// 固定列
                    }
                    <th rowSpan="2">日付</th>
                    <th rowSpan="2">目標</th>
                    <th rowSpan="2">振返り</th>
                    {// 数値目標列ヘッダ・数値目標数だけrowSpan設定
                    }
                    <th colSpan="3">数値目標<a href="#">目標を追加する</a></th>
                  </tr>
                  <tr>
                    <th>目標A(合計)</th>
                    <th>目標B(平均)</th>
                    <th>目標C(合計)</th>
                  </tr>
                </thead>
                <tbody>
                  {// 1週間分の行数用意。日曜～土曜？
                  }
                  <tr>
                    {// 固定列
                    }
                    <td>2017/06/09</td>
                    <td>がんばる</td>
                    <td>がんばった</td>
                    {// 追加分
                    }
                    <td>100</td>
                    <td>20</td>
                    <td>100000</td>
                  </tr>
                  {// 目標の進捗表示行。週・月・年
                  }
                  <tr>
                    <td colSpan="3">目標値/進捗(週)</td>
                    {// 追加分
                    }
                    <td>100/5%</td>
                    <td>20</td>
                    <td>100000/10%</td>
                  </tr>
                  <tr>
                    <td colSpan="3">目標値/進捗(月)</td>
                    {// 追加分
                    }
                    <td>100/5%</td>
                    <td>20</td>
                    <td>100000/10%</td>
                  </tr>
                  <tr>
                    <td colSpan="3">目標値/進捗(年)</td>
                    {// 追加分
                    }
                    <td>100/5%</td>
                    <td>20</td>
                    <td>100000/10%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }
});

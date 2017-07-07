/*
 * DateBoxの親component
 * props.source_dateを元に一週間分の日付を取得し、
 * それぞれの日付で子componentを用意する
 */
var DateParentBox = React.createClass({
  update_target_date(source_date) {
    console.log("date_update_target_date()");
    // 週の初日を得る
    var dt = new Date(source_date);
    
  },
  render () {
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

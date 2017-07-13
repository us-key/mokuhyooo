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
      dateValue: []
    };
  },
  componentWillMount() {
    console.log("date_componentWillMount()");
    this.getDateValue(this.getTargetDate(this.props.source_date));
  },
  shouldComponentUpdate(nextProps, nextState) {
    console.log("date_shouldComponentUpdate()");
    // prosp.source_dateが変更された場合、getDateValue呼出(ajax)
    // state.dateValueが変更された場合(getDateValueのajax結果)、rerender
    if (this.getTargetDate(this.props.source_date)
        !== this.getTargetDate(nextProps.source_date)) {
      console.log("date:再取得");
      this.getDateValue(this.getTargetDate(nextProps.source_date));
      return false;
    } else if((this.state.dateValue !== nextState.dateValue)) {
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
  // 日付ごとにT⇒Rの順でajaxリクエスト
  getDateValue(firstDay) {
    console.log("date_getDateValue()");
    console.log("target_date:" + firstDay);
    var dt = new Date(firstDay);
    // 日付をキー、データの連想配列を要素とした連想配列(1件ずつ配列に詰める)
    var data = {};
    // 作成した連想配列を詰める配列
    var dataArr = [];
    // ajaxで目標・振り返り取得用の配列;
    let typeArr = ['T', 'R'];
    var jqXHRList = [];
    var dateArr = [];
    for (var i = 0; i < 7; i++) {
      var dtKey = dt.getFullYear() + "/" + ("0" + (dt.getMonth() + 1)).slice(-2)
                  + "/" + ("0" + dt.getDate()).slice(-2);
      // 後でレコードとセットの配列に詰めるために配列にセットしておく
      dateArr.push(dtKey);
      for (var type of typeArr) {
        const typeVal = type;
        jqXHRList.push($.ajax({
            url:this.props.url,
            dataType: 'json',
            data: {
              record_date: dtKey,
              target_unit: 'D',
              target_review_type: type
            }
        }));
      }
      dt.setDate(dt.getDate() + 1);
    }
    // 順番が保証されるよう受け取る
    $.when.apply($, jqXHRList).done(function() {
      var k = 0;
      dateData = {};
      for (var j = 0; j < arguments.length; j++) {
        result = arguments[j][0];
        console.log("date:" + dateArr[k]);
        // 偶数がT,偶数がR
        if (j % 2 === 0) {
          dateData['target_id'] = result.id ? result.id : "";
          dateData['target_comment'] = result.comment ? result.comment : "";
        } else {
          dateData['review_id'] = result.id ? result.id : "";
          dateData['review_comment'] = result.comment ? result.comment : "";
        }
        // 2件ごとにdataを詰める(奇数のときに詰める)
        if (j % 2 !== 0) {
          // 参照渡しにならないよう、一度JSONに変換して戻したものを詰める
          // 中身は1件だけの連想配列の連想配列
          // {'yyyy/MM/dd' : {'target_id' : xxx,  'target_comment' : xxx, ...}}
          data[dateArr[k]] = dateData;
          const dataVal = JSON.parse(JSON.stringify(data));
          dataArr.push(dataVal);
          data = {};
          // 日付加算用のインデックスをカウントアップ
          k += 1;
        }
      }
      this.setState({
        dateValue : dataArr
      });
    }.bind(this));



    /*
          success: function(result) {
            if ('T' === typeVal) {
              console.log("success:" + dtVal + "_" + typeVal);
              console.log(dateData['target_comment']);
              dateData['target_id'] = result.id ? result.id : "";
              dateData['target_comment'] = result.comment ? result.comment : "";
            } else if ('R' === typeVal) {
              console.log("success:" + dtVal + "_" + typeVal);
              dateData['review_id'] = result.id ? result.id : "";
              dateData['review_comment'] = result.comment ? result.comment : "";
            }
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
      }
      data[dtVal] = dateData;
      dt.setDate(dt.getDate() + 1);
    }
    this.setState({
      dateValue: data
    })
    */
  },
  render () {
    console.log("date_render()");
    // 日毎のコメントを日付分だけ取得して配列か何かに詰める
    // 自分で作った数値目標を日付分だけ取得して配列か何かに詰める
    var dateNode = this.state.dateValue.map(function (data) {
      // キー取得
      var key = [];
      for (var i in data) {key.push(i);} // 1件のみセットされる想定
      return (
        <tr key={key[0]}>
          <td>
            {key[0]}
          </td>
          {// この後に日付毎のコメント、数値目標を詰める
          }
          <td id={data[key[0]]['target_id']}>{data[key[0]]['target_comment']}</td>
          <td id={data[key[0]]['review_id']}>{data[key[0]]['review_comment']}</td>
          <td>100</td>
          <td>20</td>
          <td>100000</td>
        </tr>
      );
    });
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
                    {dateNode}
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

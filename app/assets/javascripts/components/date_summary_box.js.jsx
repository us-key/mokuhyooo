/*
 * DateBoxの子component
 * 親から週・月・年の単位ごとに作成される。
 * item毎に指定された単位のサマリをajaxで取得し表示する。
 * props:
 *   target_date:unit毎に対象年・月・週の初日がセットされる想定
 *   items: 数値目標のヘッダ
 *   unit: 集計単位 Y:年,M:月,W:週
 */
var DateSummaryBox = React.createClass({
  getInitialState() {
    return {
      item_values: {}
    };
  },
  getTargetDateFromTo(props) {
    var target_date_from = new Date(props.target_date);
    var target_date_to = new Date(props.target_date);
    switch(props.unit) {
      case 'W' :
        target_date_to.setDate(target_date_to.getDate() + 6);
        break;
      case 'M' :
        target_date_to = addDate(target_date_to, 1, 'MM');
        target_date_to.setDate(target_date_to.getDate() - 1);
        break;
      case 'Y' :
        target_date_to = addDate(target_date_to, 1, 'YYYY');
        target_date_to.setDate(target_date_to.getDate() - 1);
        break;
    }
    this.setState({
      target_date_from: target_date_from,
      target_date_to: target_date_to
    });
    return [target_date_from, target_date_to];
  },
  componentWillReceiveProps(nextProps) {
    var prev_target_date_from = this.state.target_date_from
    var next_target_date_arr = this.getTargetDateFromTo(nextProps);
    // target_date_fromまたはitemsが変わった時のみ再取得
    if ((next_target_date_arr[0] != prev_target_date_from)
        || this.props.items != nextProps.items) {
      this.getItemValues(next_target_date_arr);
    }
  },
  shouldComponentUpdate(nextProps, nextState) {
    // ajax結果でsetStateされたら再描画
    if (this.state.item_values != nextState.item_values) {
      return true;
    } else {
      return false;
    }
  },
  // target_date_from/toを元に数値目標一覧を受け取りsetStateする
  getItemValues(next_target_date_arr) {
    var t_d_from = next_target_date_arr[0];
    var t_d_to = next_target_date_arr[1];
    var target_date_from_str =
      [t_d_from.getFullYear(),
       t_d_from.getMonth()+1,
       t_d_from.getDate()].join('/');
    var target_date_to_str =
      [t_d_to.getFullYear(),
       t_d_to.getMonth()+1,
       t_d_to.getDate()].join('/');
    $.ajax({
      url: '/api/v1/date_targets_summary.json',
      dataType: 'json',
      data: {
        target_date_from: target_date_from_str,
        target_date_to: target_date_to_str
      },
      success: function(result) {
        this.setState ({
          // result: {{2:{target_id: x, value: xxx}, 3:{target_id:y, value:yyy}}}
          item_values: result
        });
      }.bind(this)
    });
  },
  sendTargetDate(e) {
    this.props.onEventCallBack(e, this.props.target_date.substr(0,7));
    return;
  },
  render () {
    var items = this.props.items;
    var item_values = this.state.item_values;
    var blank = {};
    var summary_label = "合計・平均/進捗(";
    switch(this.props.unit) {
      case 'W' : summary_label += "週)"; break;
      case 'M' : summary_label += (this.props.target_date.split("/",2)[1] + "月)"); break;
      case 'Y' : summary_label += (this.props.target_date.split("/",2)[0] + "年)"); break;
    }
    // target_idは数値目標のID。
    var itemsBox = Object.keys(this.state.item_values).map(function(key, idx) {
      var item_arr = item_values[key]; // {"target_id": xxx, "value": xxx, "percent": xxx}
      // {"qt_id": xx, "name": xx, "type": xx, "kind": xx, "zero_flg": xx, "deimal_flg": xx}
      var header_arr = (items[key] ? items[key] : {"qt_id":"", "name":"", "type":"", "kind":"", "zero_flg":"", "decimal_flg":""});
      // 数値目標のタイプをDateItemBoxに設定する
      if (header_arr["kind"] == "TI" || header_arr["kind"] == "TD") {
        var hour = item_arr["value"]/60|0;
        if (hour.toString().length < 2) {
          hour = ("00" + hour).substr(-2);
        }
        return (
          // 時間・時刻：中央揃え
          <td style={{"textAlign":"center"}}>
            {hour}：{("00" + parseInt(item_arr["value"]%60)).substr(-2)}
            <br/>
            {item_arr["percent"]}%
          </td>
        );
      } else {
        var val = (header_arr["decimal_flg"] === "0") ? parseInt(item_arr["value"]) : item_arr["value"];
        return (
          // 数量：右寄せ
          <td style={{"textAlign":"right"}}>
            {val}
            <br/>
            {item_arr["percent"]}%
          </td>
        );
      }
    });
    return (
      <tr onClick={(e) => this.sendTargetDate(e)}>
        <th></th>
        <td colSpan="2" style={{"textAlign":"center"}}>
          {summary_label}
        </td>
        {// 目標BOX
        }
        {itemsBox}
      </tr>
    );
  }
});

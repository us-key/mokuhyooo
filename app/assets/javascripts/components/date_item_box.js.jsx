/*
 * 日付毎・項目毎の子component
 * 日付、数値目標のID、項目値、タイプ等を親からもらい、
 * 項目描画を行う.
 * props:
 *   id:          QuantitativePerformance.id
 *   target_id:   QuantitativeTarget.id
 *   item_value:  QuantitativePerformance.performance_value
 *   type:        QuantitativeTarget.target_type
 *   kind:        QuantitativeTarget.quantity_kind
 *   flg:         QuantitativeTarget.default_zero_flg
 *
 */
var DateItemBox = React.createClass({
  getInitialState() {
    console.log("date_item_getInitialState()");
    var time = this.getTime(this.props);
    return {
      item_value: this.props.item_value,
      base_hour: time[0],
      base_minute: time[1]
    };
  },
  componentWillReceiveProps(nextProps) {
    console.log("date_child_componentWillReceiveProps()");
    var time = this.getTime(nextProps);
    this.setState({
      item_value: nextProps.item_value,
      base_hour: time[0],
      base_minute: time[1]
    });
  },
  getTime(props) {
    var hour = 0;
    var minute = 0;
    if (props.kind && ((props.kind == "TI") || (props.kind == "TD"))) {
      hour = parseInt(props.item_value / 60);
      minute = props.item_value % 60;
    }
    return [hour, minute];
  },
  shouldComponentUpdate(nextProps, nextState) {
    console.log("date_item_shouldComponentUpdate()");
    // 一旦常に再描画
    return true;
  },
  onChangeText(e) {
    console.log("date_item_onChangeText()");
    this.setState({item_value: e.target.value});
  },
  onChangeHour(e) {
    console.log("date_item_onChangeHour()");
    this.setState({
      base_hour: e.target.value,
      item_value: this.state.base_minute + e.target.value * 60
    });
  },
  onChangeMinute(e) {
    console.log("date_item_onChangeMinute()");
    this.setState({
      base_minute: e.target.value,
      item_value: this.state.base_hour * 60 + e.target.value
    });
  },
  render() {
    // 目標・振り返りはtextarea,他はinputtext
    if ((this.props.target_id == -1) || (this.props.target_id == 0)) {
      return (
        <td>
         <textarea id={this.props.id}
                value={this.state.item_value}
            className="form-control item_value"
             onChange={this.onChangeText}>
         </textarea>
        </td>
      );
    } else {
      // TODO kindによって入力コンポーネント切替
      // ⇒inputを2つ出す場合でも、サーバーに登録する値は隠し項目で持つようにしてそいつを投げる
      // TODO 初期表示時にどうするかは要検討
      if ((this.props.kind == "TI") || (this.props.kind == "TD")) {
        var inputStyle = {
          width: "30px"
        }
        return (
          <td>
           <input id={this.props.id}
               value={this.state.item_value}
           className="item_value"
                type="hidden"/>
           <input value={this.state.base_hour}
                  style={inputStyle}
               onChange={this.onChangeHour}
                   type="number"/>:
           <input value={this.state.base_minute}
                  style={inputStyle}
               onChange={this.onChangeMinute}
                   type="number"/>
          </td>
        );
      } else {
        return (
          <td>
           <input id={this.props.id}
               value={this.state.item_value}
           className="form-control item_value"
            onChange={this.onChangeText}
                type="number">
           </input>
          </td>
        );
      }
    }
  }

});

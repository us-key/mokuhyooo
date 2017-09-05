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
    var time = this.getTime(this.props);
    return {
      item_value: this.props.item_value,
      base_hour: time[0],
      base_minute: time[1]
    };
  },
  componentWillReceiveProps(nextProps) {
    var time = this.getTime(nextProps);
    this.setState({
      item_value: nextProps.item_value,
      base_hour: time[0],
      base_minute: time[1]
    });
  },
  getTime(props) {
    if (props.kind && ((props.kind == "TI") || (props.kind == "TD"))) {
      if (props.item_value) {
        return [props.item_value/60|0, props.item_value%60]
      }
    }
    return ["", ""];
  },
  shouldComponentUpdate(nextProps, nextState) {
    // 一旦常に再描画
    return true;
  },
  onChangeText(e) {
    e.preventDefault;
    this.setState({item_value: e.target.value});
  },
  onChangeHour(e) {
    e.preventDefault;
    this.setState({
      base_hour: parseInt(e.target.value),
      item_value: parseInt(this.state.base_minute) + e.target.value * 60
    });
  },
  onChangeMinute(e) {
    e.preventDefault;
    this.setState({
      base_minute: parseInt(e.target.value),
      item_value: parseInt(this.state.base_hour) * 60 + parseInt(e.target.value)
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
      // kindによって入力コンポーネント切替
      // ⇒inputを2つ出す場合でも、サーバーに登録する値は隠し項目で持つようにして
      // そいつを投げる
      if ((this.props.kind == "TI") || (this.props.kind == "TD")) {
        // form-inlineスタイルの上書き
        var inputStyle = {
          width: "25px",
          display: "inherit"
        }
        return (
          <td>
           <input id={this.props.id}
               value={this.state.item_value}
           className="item_value"
                type="hidden"/>
           <input value={this.state.base_hour}
              className="form-control"
                  style={inputStyle}
               onChange={this.onChangeHour}
                   type="number"
                    min="0"
                    max="47"/>
           ：
           <input value={this.state.base_minute}
                  style={inputStyle}
              className="form-control"
               onChange={this.onChangeMinute}
                   type="number"
                    min="0"
                    max="59"/>
          </td>
        );
      } else {
        return (
          <td>
           <input id={this.props.id}
               value={this.state.item_value}
           className="form-control item_value"
            onChange={this.onChangeText}
                type="number"
                 min="0">
           </input>
          </td>
        );
      }
    }
  }

});

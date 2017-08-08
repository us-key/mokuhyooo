/*
 * 日付毎・項目毎の子component
 * 日付、数値目標のID、項目値、タイプ等を親からもらい、
 * 項目描画を行う
 *
 */
var DateItemBox = React.createClass({
  getInitialState() {
    console.log("date_item_getInitialState()");
    return {
      item_value: this.props.item_value
    };
  },
  componentWillReceiveProps(nextProps) {
    console.log("date_child_componentWillReceiveProps()");
    this.setState({
      item_value: nextProps.item_value
    });
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
  render() {
    // 目標・振り返りはtextarea,他はinputtext
    if ((this.props.target_id == -1) || (this.props.target_id == 0)) {
      return (
        <td className="commentCol">
         <textarea id={this.props.id}
                value={this.state.item_value}
            className="form-control"
             onChange={this.onChangeText}>
         </textarea>
        </td>
      );
    } else {
      return (
        <td className="qtyCol">
         <input id={this.props.id}
             value={this.state.item_value}
         className="form-control"
          onChange={this.onChangeText}
              type="number">
         </input>
        </td>
      );
    }
  }

});

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
 *   zero_flg:    QuantitativeTarget.default_zero_flg
 *   decimal_flg: QuantitativeTarget.decimal_flg
 *
 */
var DateItemBox = React.createClass({
  getInitialState() {
    var time = this.getTime(this.props);
    var val = (this.props.decimal_flg === "0"
        && !isReallyNaN(this.props.item_value)
        && !(this.props.item_value != ""))
      ? parseInt(this.props.item_value)
      : this.props.item_value;
    return {
      item_value: val,
      base_hour: time[0],
      base_minute: time[1],
      inputHeight: 20
    };
  },
  componentDidMount() {
    var itemNode = "textarea#" + this.props.id;
    if (this.props.id != "") {
      var item = $(itemNode)[0];
      if (typeof item !== "undefined") {
        this.changeHeight(item);
        return;
      }
    }
    this.setState({inputHeight: 20});
  },
  componentWillReceiveProps(nextProps) {
    var time = this.getTime(nextProps);
    var val = (nextProps.decimal_flg === "0" && !isReallyNaN(nextProps.item_value)) ? parseInt(nextProps.item_value) : nextProps.item_value;
    this.setState({
      item_value: val,
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
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.id == this.props.id) {
      return;
    }
    var itemNode = "textarea#" + this.props.id;
    if (this.props.id != "" && typeof itemNode !== "undefined") {
      var item = $(itemNode)[0];
      if (typeof item !== "undefined") {
        this.changeHeight(item);
        return;
      }
    }
    this.setState({inputHeight: 20})
  },
  onChangeText(e) {
    e.preventDefault;
    this.setState({item_value: e.target.value});
    if (typeof e.target !== "undefined") {
      this.changeHeight(e.target);
    }
  },
  onChangeVal(e) {
    var val = 0;
    if (this.props.decimal_flg === "0") {
      val = parseInt(e.target.value);
    } else {
      val = e.target.value;
    }
    this.setState({item_value: val});
  },
  changeHeight(item) {
    console.log("date_item_box:changeHeight")
    // 高さ
    if(item.scrollHeight > item.offsetHeight){
      this.setState({inputHeight: item.scrollHeight+1});
    }else{
      var dom = $(item);
      dom.height(dom.height() - Number(dom.css("lineHeight").split("px")[0])+1);
      dom.height(item.scrollHeight+1);
      this.setState({inputHeight: dom.height()});
    }
  },
  onChangeHour(e) {
    e.preventDefault;
    this.calcMin(e.target.value, this.state.base_minute);
  },
  onChangeMinute(e) {
    e.preventDefault;
    this.calcMin(this.state.base_hour, e.target.value);
    this.setState({
      base_minute: parseInt(e.target.value),
      item_value: parseInt(this.state.base_hour) * 60 + parseInt(e.target.value)
    });
  },
  calcMin(hour, minute) {
    if (!hour && !minute) {
      this.setState({
        base_hour: "",
        base_minute: "",
        item_value: ""
      });
      return;
    }
    var base_hour;
    var base_minute;
    var item_value = 0;
    if (hour) {
      base_hour = parseInt(hour);
      item_value += parseInt(base_hour) * 60;
    } else {
      base_hour = "";
    }
    if (minute) {
      base_minute = parseInt(minute);
      item_value += parseInt(base_minute);
    } else {
      base_minute = "";
    }
    this.setState({
      base_hour: base_hour,
      base_minute: base_minute,
      item_value: item_value
    })
  },
  render() {
    // 目標・振り返りはtextarea,他はinputtext
    if ((this.props.target_id == -1) || (this.props.target_id == 0)) {
      return (
        <td>
         <textarea id={this.props.id}
                value={this.state.item_value}
            className="form-control item_value"
             onChange={this.onChangeText}
                style={{height: this.state.inputHeight}}
             >
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
            onChange={this.onChangeVal}
                type="number"
                 min="0">
           </input>
          </td>
        );
      }
    }
  }

});

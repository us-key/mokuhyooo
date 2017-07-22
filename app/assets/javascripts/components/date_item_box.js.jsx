/*
 * 日付毎・項目毎の子component
 * 日付、数値目標のID、タイプ等を親からもらい、
 * ajaxでの値取得、項目描画を行う
 *
 */
var DateItemBox = React.createClass({
  getInitialState() {
    console.log("date_item_getInitialState()");
    return {
      item_val:""
    };
  },
  componentWillMount() {
    console.log("date_item_componentWillMount()");
    this.getItemVal();
  },
  shouldComponentUpdate(nextProps, nextState) {
    console.log("date_item_shouldComponentUpdate()");
    // 一旦常に再描画
    return true;
  },
  getItemVal() {
    // 目標/振返りのタイプ
    var t_r_type = "";
    if (this.props.item_id==-1) {
      t_r_type = "T";
      // 目標
    } else if (this.props.item_id==0) {
      t_r_type = "R";
      // 振返り
    } else {
      // 数値目標
    }
    console.log(t_r_type);
    console.log(this.props.target_date);
    if (t_r_type != "") {
      // 目標・振り返りの取得
      $.ajax({
        url: this.props.url,
        dataType: 'json',
        data: {
          record_date: this.props.target_date,
          target_unit: "D",
          target_review_type: t_r_type
        },
        success: function(result) {
          console.log("item_val_id:" + result.id);
          console.log("item_val:" + result.comment);
          this.setState({
            // undefinedの場合ブランクを設定
            item_val_id: result.id ? result.id : "",
            item_val: result.comment ? result.comment : ""
          });
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    }
  },
  onChangeText(e) {
    console.log("date_item_onChangeText()");
    this.setState({item_val: e.target.value});
  },
  render() {
    // 目標・振り返りはtextarea,他はinputtext
    if ((this.props.item_id == -1) || (this.props.item_id == 0)) {
      return (
        <td>
         <textarea id={this.state.item_val_id}
                value={this.state.item_val}
             onChange={this.onChangeText}>
         </textarea>
        </td>
      );
    } else {
      return (
        <td>
         <input id={this.state.item_val_id}
                value={this.state.item_val}
             onChange={this.onChangeText}>
         </input>
        </td>
      );
    }
  }

});

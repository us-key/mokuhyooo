/*
 * DateBoxの子component
 * 親から日付毎に作成される。
 * 日付ごとの入力値の保存はこのcomponentのボタンで行う。
 * 各入力用boxはprops.itemsごとに子コンポーネントを作成する。
 *
 */
var DateChildBox = React.createClass({
/*
  getComment(target_date, type) {
    console.log("date_child_getComment()")
    console.log("date_child:target_date:"+ target_date + "/type:" + type);
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      data: {
        record_date: target_date,
        target_unit: "D",
        target_review_type: type
      },
      success: function(result) {
        console.log(this.props.prefix+"_id:" + result.id);
        console.log(this.props.prefix+"_comment:" + result.comment);
        this.setState({
          // undefinedの場合ブランクを設定
          com_id: result.id ? result.id : "",
          comment: result.comment ? result.comment : ""
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
*/
  getInitialState() {
    console.log("date_child_getInitialState()");
    return {
      item_values: {}
    };
  },
  componentWillReceiveProps(nextProps) {
    console.log("date_child_componentWillReceiveProps()");
    this.getItemValues(nextProps.target_date)
  },
  componentWillMount() {
    console.log("date_child_componentWillMount()");
    this.getItemValues(this.props.target_date);
  },
  shouldComponentUpdate(nextProps, nextState) {
    console.log("date_child_shouldComponentUpdate()");
    // ajax結果でsetStateされたら再描画
    if (this.state.item_values != nextState.item_values) {
      console.log("date_child:再描画");
      return true;
    } else {
      console.log("date_child:何もしない");
      return false;
    }
  },
  // props.target_dateを元に数値目標一覧を受け取りsetStateする
  getItemValues(target_date) {
    $.ajax({
      url: '/api/v1/date_targets.json',
      dataType: 'json',
      data: {
        target_date: target_date,
      },
      success: function(result) {
        console.log("date_child_ajax(get)");
        this.setState ({
          item_values: result
        });
      }.bind(this)
    });
  },
  render () {
    console.log("date_child_render()");
    var url = this.props.url;
    var target_date = this.props.target_date;
    var items = this.props.items;
    var item_values = this.state.item_values;
    var blank = {};
    // item_idは数値目標のID。個別の入力値のIDではない。目標・振返りには-1,0を設定
    var itemsBox = Object.keys(this.state.item_values).map(function(key, idx) {
      var item_arr = item_values[key]; // {"target_id": xxx, "id": xxx, "value": xxx}
      return (
        <DateItemBox
          id = {item_arr["id"]}
          target_id = {item_arr["target_id"]}
          item_value = {item_arr["value"]}
        />
      );
    });
    return (
      <tr>
        <td>
          <a href="#">
          <span id="register"
                className="glyphicon glyphicon-save"
                aria-hidden="true"
                onClick={e => this.onClick(e, this.state.com_id, this.state.comment)}>
          </span>
        </a>
        </td>
        <td>
        {target_date}
        </td>
        {// 目標BOX
        }
        {itemsBox}
      </tr>
    );
  }
});

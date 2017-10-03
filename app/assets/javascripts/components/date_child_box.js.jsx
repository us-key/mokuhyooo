/*
 * DateBoxの子component
 * 親から日付毎に作成される。
 * 日付ごとの入力値の保存はこのcomponentのボタンで行う。
 * 各入力用boxはprops.itemsごとに子コンポーネントを作成する。
 *
 */
var DateChildBox = React.createClass({

  getInitialState() {
    return {
      item_values: {}
    };
  },
  componentWillMount() {
    this.getItemValues(this.props.target_date);
  },
  componentWillReceiveProps(nextProps) {
    if ((this.props.target_date != nextProps.target_date)
        || this.props.items != nextProps.items) {
      this.getItemValues(nextProps.target_date);
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
  // props.target_dateを元に数値目標一覧を受け取りsetStateする
  getItemValues(target_date) {
    $.ajax({
      url: '/api/v1/date_targets.json',
      dataType: 'json',
      data: {
        target_date: target_date,
      },
      success: function(result) {
        this.setState ({
          item_values: result
        });
      }.bind(this)
    });
  },
  onSubmit(e) {
    e.preventDefault();
    // 行のjQueryオブジェクト取得
    var tr = $(e.target).parent().parent().parent();
    var th = tr.find('th');
    var td = tr.find('td');
    var date = "";
    var record = {};
    date = th.eq(0).text();
    for (var i = 0, len = td.length; i < len; i++) {
      // 0,1：目標・振り返り
      // 2～：数値目標(ソート順:2～)
      var id = td.eq(i).children('.item_value')[0].id;
      // TODO kindによりvalueの取り方を変える必要あり
      var val = td.eq(i).children('.item_value')[0].value;
      record[i]= {"id": id, "value": val};
    }
    // ajaxでレコード送信
    // requestの形式
    // {
    //   date: '2017/08/01'
    //   record: {
    //     xx: {id: xx, value: xx} // key:sort_order⇒itemをサーバー側で識別するために使用。
    //     yy: {id: yy, value: yy}
    //     ...
    //   }
    // }
    $.ajax({
      url: '/api/v1/date_targets.json',
      type: 'POST',
      dataType: 'json',
      data: {
        'date': date,
        'record': record
      },
      success: function(result) {
        this.props.showMsg(result.message);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)

    });
  },
  render () {
    var url = this.props.url;
    var target_date = this.props.target_date;
    var items = this.props.items;
    var item_values = this.state.item_values;
    var blank = {};
    // target_idは数値目標のID。個別の入力値のIDではない。目標・振返りには-1,0を設定
    var itemsBox = Object.keys(this.state.item_values).map(function(key, idx) {
      var item_arr = item_values[key]; // {"target_id": xxx, "id": xxx, "value": xxx}
      var header_arr = (items[key] ? items[key] : {"qt_id":"", "name":"", "type":"", "kind":"", "flg":""}); // {"qt_id": xx, "name": xx, "type": xx, "kind": xx, "flg": xx}
      // TODO 数値目標のタイプとかをDateItemBoxに設定する
      return (
        <DateItemBox
          id = {item_arr["id"]}
          target_id = {item_arr["target_id"]}
          item_value = {item_arr["value"]}
          type = {header_arr["type"]}
          kind = {header_arr["kind"]}
          flg = {header_arr["flg"]}
        />
      );
    });
    return (
      <tr>
        <th>
          <a>
            <span id="register"
                  className="glyphicon glyphicon-save"
                  aria-hidden="true"
                  onClick={e => this.onSubmit(e, this.state.com_id, this.state.comment)}>
            </span>
          </a>
          {target_date}
        </th>
        {// 目標BOX
        }
        {itemsBox}
      </tr>
    );
  }
});

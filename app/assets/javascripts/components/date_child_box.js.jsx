/*
 * DateBoxの子component
 * 親から日付毎に作成される。
 * 日付ごとの入力値の保存はこのcomponentのボタンで行う。
 * 各入力用boxはprops.itemsごとに子コンポーネントを作成する。
 *
 */
var DateChildBox = React.createClass({
  getInitialState() {
    console.log("date_child_getInitialState()");
    return {
      com_id:"",
      target_comment:"",
      review_comment:""
    };
  },
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
  render () {
    console.log("date_child_render()");
    var url = this.props.url
    var target_date = this.props.target_date
    var items = this.props.items
    var blank = {}
    // item_idは数値目標のID。個別の入力値のIDではない。目標・振返りには-1,0を設定
    var itemsBox = Object.keys(this.props.items).map(function(key, idx) {
      return (
        <DateItemBox
          url={url}
          target_date={target_date}
          item_id={key}
          items={items[key]}
        />
      )
    })
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
        <DateItemBox
          url={url}
          target_date={target_date}
          item_id="-1"
          items={blank}
        />
        {// 振返りBOX
        }
        <DateItemBox
          url={url}
          target_date={target_date}
          item_id="0"
          items={blank}
        />
        {// 数値目標BOX
        }
        {itemsBox}
      </tr>
    );
  }
});

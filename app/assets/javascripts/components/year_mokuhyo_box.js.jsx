var YearMokuhyoBox = React.createClass({
  getInitialState() {
    console.log("getInitialState()");
    return {data: [],
            readonly: true};
  },
  componentDidMount() {
    console.log("componentDidMount()");
    $('#registerPY')[0].style.display = 'none';
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(result) {
        console.log(result.data);
        this.setState({data: result.data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  onClickG(e) {
    console.log("onClickG()");
    this.setState({readonly: !this.state.readonly});
    if ($('#registerPY')[0].style.display != 'none') {
      $('#registerPY')[0].style.display = 'none';
    } else {
      $('#registerPY')[0].style.display = '';
    }
  },
  onClickR(e) {
    console.log("onClickR()");
    e.preventDefault();
    var id = ReactDOM.findDOMNode(this.refs.prevYearCom).id;
    var comment = ReactDOM.findDOMNode(this.refs.prevYearCom).value.trim();
    if (!comment) {
      // TODO エラーメッセージ表示
      return;
    }
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      data: {
        'id': id,
        'comment': cmment
      },
      success: function(data) {
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render() {
    console.log("render()");
    return(
      <div className="YearMokuhyoBox">
        <div className="panel panel-warning">
          <div className="panel-heading">
            <a data-toggle="collapse" href=".prevYear">昨年の振り返り</a>
            <span onClick={this.onClickG} className="glyphicon glyphicon-pencil" aria-hidden="true"/>
            <span id='registerPY' onClick={this.onClickR}>登録</span>
          </div>
          <div className="prevYear panel collapse">
            <textarea readOnly={this.state.readonly} id={this.state.data.id} className="form-control prevYearReviewInput" ref="prevYearCom">
              {this.state.data.comment}
            </textarea>
          </div>
        </div>
        <div className="panel panel-info">
          <div className="panel-heading">
            <a data-toggle="collapse" href=".thisYear">今年の目標</a> <a href="#"><span className="glyphicon glyphicon-pencil" aria-hidden="true"/></a>
          </div>
          <div className="thisYear panel collapse in">
            <textarea className="form-control thisYearMokuhyoInput">{this.state.data.comment}</textarea>
          </div>
        </div>
        <div className="panel panel-success">
          <div className="panel-heading">
            <a data-toggle="collapse" href=".thisYearRev">今年の振り返り</a> <a href="#"><span className="glyphicon glyphicon-pencil" aria-hidden="true"/></a>
          </div>
          <div className="thisYearRev panel collapse">
            <textarea className="form-control thisYearReviewInput"/>
          </div>
        </div>
      </div>
    );
  }
});

var YearMokuhyoBox = React.createClass({
  render: function() {
    return(
      <div className="yearMokuhyoBox">
        <Mokuhyo data={this.props.data}/>
      </div>
    );
  }
});

var Mokuhyo = React.createClass({
  render: function() {
    var mokuhyoNodes = this.props.data.map(function(mokuhyo) {
      return(
        <div>
          <div className="panel panel-warning">
            <div className="panel-heading">
              <a data-toggle="collapse" href=".prevYear">昨年の振り返り</a> <a href="#">編集</a>
            </div>
            <div className="prevYear panel collapse">
              <textarea className="form-control prevYearReviewInput"/>
            </div>
          </div>
          <div className="panel panel-info">
            <div className="panel-heading">
              <a data-toggle="collapse" href=".thisYear">今年の目標({mokuhyo.thisyear})</a> <a href="#">編集</a>
            </div>
            <div className="thisYear panel collapse in">
              <textarea className="form-control thisYearMokuhyoInput"/>
            </div>
          </div>
          <div className="panel panel-success">
            <div className="panel-heading">
              <a data-toggle="collapse" href=".thisYearRev">今年の振り返り</a> <a href="#">編集</a>
            </div>
            <div className="thisYearRev panel collapse">
              <textarea className="form-control thisYearReviewInput"/>
            </div>
          </div>
        </div>
      );
    });
    return (
      <div className="yearMokuhyo">
        {mokuhyoNodes}
      </div>
    );
  }
});

var MonthMokuhyoBox = React.createClass({
  render: function() {
    return(
      <div className="monthMokuhyoBox">
        <MonthMokuhyo data={this.props.data}/>
      </div>
    );
  }
});

var MonthMokuhyo = React.createClass({
  render: function() {
    var mokuhyoNodes = this.props.data.map(function(mokuhyo) {
      return(
        <div>
          <div className="panel panel-warning">
            <div className="panel-heading">
              <a data-toggle="collapse" href=".prevMonth">先月の振り返り</a> <a href="#">編集</a>
            </div>
            <div className="prevMonth panel collapse">
              <textarea className="form-control prevMonthReviewInput"/>
            </div>
          </div>
          <div className="panel panel-info">
            <div className="panel-heading">
              <a data-toggle="collapse" href=".thisMonth">今月の目標({mokuhyo.thismonth})</a> <a href="#">編集</a>
            </div>
            <div className="thisMonth panel collapse in">
              <textarea className="form-control thisMonthMokuhyoInput"/>
            </div>
          </div>
          <div className="panel panel-success">
            <div className="panel-heading">
              <a data-toggle="collapse" href=".thisMonthRev">今月の振り返り</a> <a href="#">編集</a>
            </div>
            <div className="thisMonthRev panel collapse">
              <textarea className="form-control thisMonthReviewsInput"/>
            </div>
          </div>
        </div>
      );
    });
    return (
      <div className="monthMokuhyo">
        {mokuhyoNodes}
      </div>
    );
  }
});

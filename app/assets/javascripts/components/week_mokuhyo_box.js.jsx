var WeekMokuhyoBox = React.createClass({
  render() {
    return(
      <div className="weekMokuhyoBox">
        <WeekMokuhyo data={this.props.data}/>
      </div>
    );
  }
});

var WeekMokuhyo = React.createClass({
  render() {
    var mokuhyoNodes = this.props.data.map(function(mokuhyo) {
      return(
        <div>
          <div className="col-md-4">
            <div className="panel panel-warning">
              <div className="panel-heading">
                先週の振り返り <a href="#"><span className="glyphicon glyphicon-pencil" aria-hidden="true"/></a>
              </div>
              <div className="panel">
                <textarea className="form-control prevWeekReviewInput"/>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="panel panel-info">
              <div className="panel-heading">
                今週の目標({mokuhyo.thisweek}) <a href="#"><span className="glyphicon glyphicon-pencil" aria-hidden="true"/></a>
              </div>
              <div className="panel">
                <textarea className="form-control thisWeekMokuhyoInput"/>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="panel panel-success">
              <div className="panel-heading">
                今週の振り返り <a href="#"><span className="glyphicon glyphicon-pencil" aria-hidden="true"/>
                </a>
              </div>
              <div className="panel">
                <textarea className="form-control thisWeekReviewInput"/>
              </div>
            </div>
          </div>
        </div>
      );
    });
    return (
      <div className="weekMokuhyo">
        {mokuhyoNodes}
      </div>
    );
  }
});

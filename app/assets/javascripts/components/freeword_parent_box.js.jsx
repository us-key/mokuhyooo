/*
 * Freewordの親component
 */
var FreewordParentBox = React.createClass({
  render() {
    console.log("parent_render()");
    console.log("source_date:" + this.props.source_date);
    return(
      <div className="row">
        <div className="col-md-6">
          <div className="panel panel-default">
            <div className="panel-heading">年</div>
            <div className="panel">
              <FreewordChildBox
                url={this.props.url}
                source_date={this.props.source_date}
                unit="Y"
              />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="panel panel-default">
            <div className="panel-heading">月</div>
            <div className="panel">
              <FreewordChildBox
                url={this.props.url}
                source_date={this.props.source_date}
                unit="M"
              />
            </div>
          </div>
        </div>
        <div className="col-md-12">
          <div className="panel panel-default">
            <div className="panel-heading">週</div>
            <div className="panel">
              <FreewordChildBox
                url={this.props.url}
                source_date={this.props.source_date}
                unit="W"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
});

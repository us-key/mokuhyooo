/*
 * Freewordの親component
 */
var FreewordParentBox = React.createClass({
  getInitialState() {
    console.log("parent_getInitialState()");
    return {
      target_date: this.props.source_date
    };
  },
  componentWillReceiveProps(nextProps) {
    console.log("parent_componentWillReceiveProps()");
    console.log("nextProps.source_date:" + nextProps.source_date);
    this.setState({
      target_date: nextProps.source_date
    });
  },
  render() {
    console.log("parent_render()");
    console.log("target_date:" + this.state.target_date);
    return(
      <div className="row">
        <div className="col-md-6">
          <div className="panel panel-default">
            <div className="panel-heading">年</div>
            <div className="panel">
              <FreewordChildBox
                url={this.props.url}
                source_date={this.state.target_date}
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
                source_date={this.state.target_date}
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
                source_date={this.state.target_date}
                unit="W"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
});

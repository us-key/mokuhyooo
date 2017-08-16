/*
 * ページ全体の親component
 */
var IndexParent = React.createClass({
  componentWillMount() {
    this.setState({
      source_date: this.props.source_date
    });
  },
  componentDidMount() {
    console.log("IndexParent_componentDidMount()");
    $('.datepicker').datetimepicker({
      format: "YYYY/MM/DD",
      icons: {
        previous: "fa fa-arrow-left",
        next: "fa fa-arrow-right"
      }
    });
  },
  onBlur(e) {
    console.log("IndexParent_onBlur()");
    this.setState({
      source_date: e.target.value
    });
  },
  render() {
    console.log("IndexParent_render()");
    console.log("source_date:" + this.state.source_date);
    return(
      <div className="parent">
        <div className="pos-horizontal">
          <div className="form-group pos-center">
            <div className="col-xs-1 col-sm-3"></div>
            <label className="col-xs-3 col-sm-2 control-label">日付：</label>
            <div className="col-xs-7 col-sm-4">
              <input type="text" id="source_date"
                     className='form-control datepicker'
                     value={this.state.source_date}
                     onBlur={this.onBlur}/>
            </div>
            <div className="col-xs-1 col-sm-3"></div>
          </div>
        </div>
        <FreewordParentBox
          url={this.props.url}
          source_date={this.state.source_date}
        />
        <DateParentBox
          url={this.props.url}
          source_date={this.state.source_date}
        />
      </div>
    );
  }
});

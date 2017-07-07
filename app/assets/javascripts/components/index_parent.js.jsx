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
        <div className="pos-center-parent">
          <div className="form-group pos-center">
            <label className='control-label'>日付</label>
            <input type="text" id="source_date"
                   className='form-control datepicker'
                   value={this.state.source_date}
                   onBlur={this.onBlur}/>
          </div>
        </div>
        <FreewordParentBox
          url={this.props.url}
          source_date={this.state.source_date}
        />
        <DateParentBox
          source_date={this.state.source_date}
        />
      </div>
    );
  }
});

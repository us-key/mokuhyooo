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
    $('.datepicker').datetimepicker({
      format: "YYYY/MM/DD",
      icons: {
        previous: "fa fa-arrow-left",
        next: "fa fa-arrow-right"
      }
    });
  },
  onFocus(e) {
    console.log('onFocus')
    $('.bootstrap-datetimepicker-widget').css('left','');
  },
  onBlur(e) {
    this.setState({
      source_date: e.target.value
    });
  },
  render() {
    return(
      <div className="parent">
        <div className="pos-horizontal">
          <div className="form-group pos-center">
            <div className="col-xs-2 col-sm-8 col-md-9">&nbsp;</div>
            <div className="col-xs-10 col-sm-4 col-md-3">
              <input type="text" id="source_date"
                     className='form-control header-date datepicker'
                     value={this.state.source_date}
                     onFocus={this.onFocus}
                     onBlur={this.onBlur}/>
            </div>
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

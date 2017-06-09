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
          <p>{mokuhyo.thisyear-1}年の振り返り<a href="#">編集</a></p>
          <input type="text" className="prevYearmokuhyoInput"/>
          <p>{mokuhyo.thisyear}年の目標<a href="#">編集</a></p>
          <input type="text" className="thisYearMokuhyoInput"/>
          <p>{mokuhyo.thisyear}年の振り返り<a href="#">編集</a></p>
          <input type="text" className="thisYearmokuhyoInput"/>
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

var WeekMokuhyoBox = React.createClass({
  render: function() {
    return(
      <div className="weekMokuhyoBox">
        <WeekMokuhyo data={this.props.data}/>
      </div>
    );
  }
});

var WeekMokuhyo = React.createClass({
  render: function() {
    var mokuhyoNodes = this.props.data.map(function(mokuhyo) {
      return(
        <div>
          <p>先週の振り返り<a href="#">編集</a></p>
          <input type="text" className="prevWeekmokuhyoInput"/>
          <p>今週の目標({mokuhyo.thisweek})<a href="#">編集</a></p>
          <input type="text" className="thisWeekMokuhyoInput"/>
          <p>今週の振り返り<a href="#">編集</a></p>
          <input type="text" className="thisWeekmokuhyoInput"/>
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

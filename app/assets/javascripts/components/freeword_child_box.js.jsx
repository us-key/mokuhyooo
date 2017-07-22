/*
 * Freewordの子component
 * Props:source_date:算出元日付
 * State:target_date:source_dateを元に算出した日付(年or月or週の初日)
 *       prev_date:prev_month用の日付
 */
var FreewordChildBox = React.createClass({
  /*
   * dataの初期化(空配列)
   * target_date,base_target_dateにprops.source_dateをセット
   */
  getInitialState() {
    console.log(this.props.unit+"_getInitialState()");
    return {
      data: [],
      target_date: this.props.source_date,
      pr_prefix: this.props.unit + "_PR",
      t_prefix: this.props.unit + "_T",
      r_prefix: this.props.unit + "_R"
    };
  },
  /*
   * source_dateを元にtarget_date算出
   */
  componentWillMount() {
    console.log(this.props.unit+"_componentWillMount()");
    this.update_target_date(this.props.source_date);
    console.log(this.state.target_date);
    console.log(this.state.prev_date);
  },
  componentWillReceiveProps(nextProps) {
    console.log(this.props.unit+"_componentWillReceiveProps()");
    console.log(this.props.unit+":nextProps.source_date:" + nextProps.source_date);
    this.update_target_date(nextProps.source_date);
  },
  update_target_date(source_date) {
    console.log(this.props.unit+"_update_target_date()");
    // 初日
    var dt = new Date(source_date);
    var prev_dt = dt;
    this.setState({
      target_date: getFirstDate(source_date, this.props.unit, false),
      prev_date:   getFirstDate(source_date, this.props.unit, true)
    });

  },
  render() {
    console.log(this.props.unit+"_render()");
    return(
      <div>
        <FreeWordBox
          unit={this.props.unit}
          type="R"
          target="prev"
          target_date={this.state.prev_date}
          url={this.props.url}
          prefix={this.state.pr_prefix}
        />
        <FreeWordBox
          unit={this.props.unit}
          type="T"
          target="this"
          target_date={this.state.target_date}
          url={this.props.url}
          prefix={this.state.t_prefix}
        />
        <FreeWordBox
          unit={this.props.unit}
          type="R"
          target="this"
          target_date={this.state.target_date}
          url={this.props.url}
          prefix={this.state.r_prefix}
        />
      </div>
    );
  }
});

var FreeWordBox = React.createClass({
  getInitialState() {
    console.log(this.props.prefix+"_getInitialState()");
    return {
      com_id:"",
      comment:"",
      message:""
    };
  },
  componentWillMount() {
    console.log(this.props.prefix+"_componentWillMount()");
    this.getComment(this.props.target_date);
  },
  shouldComponentUpdate(nextProps, nextState) {
    console.log(this.props.prefix+"shouldComponentUpdate()");
    // props.target_dateが変更された場合、getComment呼出(ajax)
    // state(com_id/comment/message)が変更された場合(getComment/onClickのajax結果)、rerender
    if (this.props.target_date !== nextProps.target_date) {
      console.log(this.props.prefix+":再取得");
      this.getComment(nextProps.target_date);
      return false;
    } else if (this.state !== nextState) {
      console.log(this.props.prefix+":再描画");
      return true;
    } else {
      console.log(this.props.prefix+":何もしない");
      return false;
    }
  },
  getComment(target_date) {
    console.log(this.props.prefix+"_getComment()")
    console.log(this.props.prefix+":target_date:"+ target_date);
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      data: {
        record_date: target_date,
        target_unit: this.props.unit,
        target_review_type: this.props.type
      },
      success: function(result) {
        console.log(this.props.prefix+"_id:" + result.id);
        console.log(this.props.prefix+"_comment:" + result.comment);
        this.setState({
          // undefinedの場合ブランクを設定
          com_id: result.id ? result.id : "",
          comment: result.comment ? result.comment : ""
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  onChangeText(e) {
    console.log(this.props.prefix+"_onChangeText()");
    this.setState({comment: e.target.value});
  },
  onClick(e, com_id, comment) {
    e.preventDefault();
    console.log(this.props.prefix+"_onClick()");
    console.log("id:"+com_id);
    console.log("comment:"+comment);
    $.ajax({
      url: this.props.url,
      type: 'POST',
      dataType: 'json',
      data: {
        'id': com_id,
        'comment': comment,
        'target_unit': this.props.unit,
        'target_review_type': this.props.type,
        'record_date': this.props.target_date
      },
      success: function(result) {
        console.log(this.props.prefix+"_Result" + result.message);
        this.setState({
          message: result.message
        });
        // メッセージ表示して2秒後に消す
        $('.register_msg').show();
        $('.register_msg').delay(1500).fadeOut(500);
        var clearMsg = setInterval(function() {
          this.setState({
            message: ""
          });
          clearInterval(clearMsg);
        }.bind(this), 2000);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
        // 過去のメッセージが再表示されないように一旦すべて消す
        $('.register_msg').text("");
        $('.register_msg').show();
        this.setState({
          message: "登録に失敗しました。再実行してください。"
        });
      }.bind(this)
    });
  },
  render() {
    console.log(this.props.prefix+"_render()");
    console.log(this.props.prefix+":target_date:"+this.props.target_date);
    const toggleTarget = "#" + this.props.prefix + "_panel";
    const panelId = this.props.prefix + "_panel";
    var panelClass = "panel collapse";
    // 目標欄のみ開いて初期表示
    if ("T" == this.props.type) {
      panelClass += " in";
    }
    var headerPanelClass = "panel panel-";
    switch(this.props.unit) {
      case "Y" : headerPanelClass += "info"; break;
      case "M" : headerPanelClass += "warning"; break;
      case "W" : headerPanelClass += "success"; break;
      default : ;
    }
    var panelTitle = "";
    switch(this.props.target) {
      case "this" : panelTitle += "今"; break;
      case "prev" : panelTitle += "前"; break;
      default : ;
    }
    switch(this.props.unit) {
      case "Y" : panelTitle += "年"; break;
      case "M" : panelTitle += "月"; break;
      case "W" : panelTitle += "週"; break;
      default : ;
    }
    panelTitle += "の";
    switch(this.props.type) {
      case "T" : panelTitle += "目標"; break;
      case "R" : panelTitle += "振り返り"; break;
      default : ;
    }
    return(
      <div className={headerPanelClass}>
        <div className="panel-heading">
          <a data-toggle="collapse" href={toggleTarget}>{panelTitle}</a>
          <a href="#"><span className="glyphicon glyphicon-pencil" aria-hidden="true"/></a>
          <a href="#"><span id='register' onClick={e => this.onClick(e, this.state.com_id, this.state.comment)}>登録</span></a>
          <span className="register_msg">{this.state.message}</span>
        </div>
        <div id={panelId} className={panelClass}>
          <textarea id={this.state.com_id}
                    className="form-control prevMonthReviewInput"
                    value={this.state.comment}
                    onChange={this.onChangeText}
                    >
          </textarea>
        </div>
      </div>
    );
  }
});

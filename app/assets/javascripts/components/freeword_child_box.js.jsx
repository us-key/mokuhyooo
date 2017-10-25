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
    this.update_target_date(this.props.source_date);
  },
  componentWillReceiveProps(nextProps) {
    this.update_target_date(nextProps.source_date);
  },
  update_target_date(source_date) {
    // 初日
    var dt = new Date(source_date);
    var prev_dt = dt;
    this.setState({
      target_date: getFirstDate(source_date, this.props.unit, false),
      prev_date:   getFirstDate(source_date, this.props.unit, true)
    });

  },
  render() {
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
    return {
      com_id:"",
      comment:"",
      message:"",
      inputHeight: 20
    };
  },
  componentDidMount() {
    var itemNode = "textarea#" + this.state.com_id;
    if (this.state.com_id != "") {
      var item = $(itemNode)[0];
      if (typeof item !== "undefined") {
        this.changeHeight(item);
        return;
      }
    }
    this.setState({inputHeight: 20});
  },
  componentWillMount() {
    this.getComment(this.props.target_date);
  },
  shouldComponentUpdate(nextProps, nextState) {
    // props.target_dateが変更された場合、getComment呼出(ajax)
    // state(com_id/comment/message)が変更された場合(getComment/onClickのajax結果)、rerender
    if (this.props.target_date !== nextProps.target_date) {
      this.getComment(nextProps.target_date);
      return false;
    } else if (this.state !== nextState) {
      return true;
    } else {
      return false;
    }
  },
  componentDidUpdate(prevProps, prevState) {
    if (prevState.com_id == this.state.com_id) {
      return;
    }
    var itemNode = "textarea#" + this.state.com_id;
    if (this.state.com_id != "" && typeof itemNode !== "undefined") {
      var item = $(itemNode)[0];
      if (typeof item !== "undefined") {
        this.changeHeight(item);
        return;
      }
    }
    this.setState({inputHeight: 20});
  },
  getComment(target_date) {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      data: {
        record_date: target_date,
        target_unit: this.props.unit,
        target_review_type: this.props.type
      },
      success: function(result) {
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
    this.setState({comment: e.target.value});
    if (typeof e.target !== "undefined") {
      this.changeHeight(e.target);
    }
  },
  changeHeight(item) {
    console.log("freeword_child_box:changeHeight")
    // 高さ
    if(item.scrollHeight > item.offsetHeight){
      this.setState({inputHeight: item.scrollHeight+1});
    }else{
      var dom = $(item);
      dom.height(dom.height() - Number(dom.css("lineHeight").split("px")[0])+1);
      dom.height(item.scrollHeight+1);
      this.setState({inputHeight: dom.height()});
      // var lineHeight = Number(dom.css("lineHeight").split("px")[0]);
      // while (true){
      //   dom.height(dom.height() - lineHeight);
      //   if(item.scrollHeight > item.offsetHeight){
      //     dom.height(item.scrollHeight+1);
      //     this.setState({inputHeight: dom.height()});
      //     break;
      //   }
      // }
    }
  },
  onClick(e, com_id, comment) {
    e.preventDefault();
    $.blockUI({
      message: getWaintMsgHtml()
    });
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
        $.unblockUI();
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
        $.unblockUI();
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
    const toggleTarget = "#" + this.props.prefix + "_panel";
    const panelId = this.props.prefix + "_panel";
    var panelClass = "panel collapse";
    // 目標欄のみ開いて初期表示
    // if ("T" == this.props.type) {
      panelClass += " in";
    // }
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
          <a>
            <span id="register"
                  className="glyphicon glyphicon-save"
                  aria-hidden="true"
                  onClick={e => this.onClick(e, this.state.com_id, this.state.comment)}>
            </span>
          </a>
          <span className="register_msg">{this.state.message}</span>
        </div>
        <div id={panelId} className={panelClass}>
          <textarea id={this.state.com_id}
                    className="form-control freewordInput"
                    value={this.state.comment}
                    onChange={this.onChangeText}
                    style={{height: this.state.inputHeight}}
                    >
          </textarea>
        </div>
      </div>
    );
  }
});

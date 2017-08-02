class Api::V1::DateTargetsController < ApplicationController
  # パラメータで渡されたtarget_dateを元にその日のフリーワード目標・振り返り、
  # 数値目標を取得し、jsonに詰めて返却する
  def index
    # TODO ログインユーザーのレコードを取得するよう絞る
    # 目標
    @target = Freeword.find_by(
      record_date: params[:target_date],
      target_unit: "D",
      target_review_type: "T"
    )
    if @target.present?
      logger.debug("id:" + @target.id.to_s)
      logger.debug("comment" + @target.comment)
    end
    # 振返り
    @review = Freeword.find_by(
      record_date: params[:target_date],
      target_unit: "D",
      target_review_type: "R"
    )
    if @review.present?
      logger.debug("id:" + @review.id.to_s)
      logger.debug("comment" + @review.comment)
    end
    # 数値目標に実績を外部結合
    @qu_pfm = QuantitativeTarget.joins(
      "LEFT OUTER JOIN quantitative_performances ON quantitative_targets.id = quantitative_performances.quantitative_target_id
                       and quantitative_performances.performance_date = '#{Date.strptime(params[:target_date], '%Y/%m/%d')}'"
      ).select("quantitative_targets.*,
                quantitative_performances.id qp_id,
                quantitative_performances.performance_value"
      )
    if @qu_pfm.present?
      logger.debug("レコードあり:" + params[:target_date])
      @qu_pfm.order("sort_order")
      @qu_pfm.each do |qp|
        logger.debug("qp_id:" + (qp.qp_id.present? ? qp.qp_id.to_s : "nil"))
        logger.debug("id:" + (qp.id.present? ? qp.id.to_s : "nil"))
        logger.debug("performance_value:" + (qp.performance_value.present? ? qp.performance_value.to_s : "nil"))
      end
    end

    render 'index', formats: 'json', handlers: 'jbuilder'
  end

  def create
    logger.debug(params[:date])
    if params[:record].present?
      # hashの値でループ
      sort_order = 2
      params[:record].values.each do |rec|
        id = rec["id"]
        val = rec["value"]
        if sort_order <= 3
          if sort_order == 2
            logger.debug("目標")
          else
            logger.debug("振返り")
          end
          # 目標/振返り
          @comment = nil
          if id.present? && (@comment = Freeword.find(id))
            logger.debug("更新")
            @comment.comment = val
            @comment.save
          else
            logger.debug("新規登録")
            if val == ""
              # TODO メッセージ出す？
            else
              @comment = Freeword.new
              @comment.comment = val
              @comment.target_unit = "D"
              # sort_orderで目標/振返りの判別
              @comment.target_review_type = (sort_order == 2 ? "T" : "R")
              @comment.record_date = Date.parse(params[:date])
              @comment.save
            end
          end
        else
          # 数値目標実績
        end

        sort_order += 1
      end
    end
    render 'show', formats: 'json', handlers: 'jbuilder'
  end

  private
    def date_target_params
      params.permit(:target_date, :date, :record)
    end
end

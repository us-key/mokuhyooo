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
  end

  private
    def date_target_params
      params.permit(:target_date)
    end
end
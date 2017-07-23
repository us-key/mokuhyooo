class Api::V1::FreewordsController < ApplicationController
  def index
    record_date_s = params[:record_date]
    target_unit = params[:target_unit]
    target_review_type = params[:target_review_type]
    if record_date_s && target_unit && target_review_type
      logger.debug(record_date_s + target_unit + target_review_type)
    end
    if record_date_s
      record_date = Time.zone.parse(record_date_s)
    end
    @data = Freeword.find_by(
      record_date: record_date,
      target_unit: target_unit,
      target_review_type: target_review_type)
    if @data.present?
      logger.debug("id:" + @data.id.to_s)
      logger.debug("comment:" + @data.comment)
    end

    render 'index', formats: 'json', handlers: 'jbuilder'
  end

  def create
    @freeword = nil
    @message = nil
    if params[:id].present? && (@freeword = Freeword.find(params[:id]))
      @freeword.comment = params[:comment]
      @freeword.save
    else
      if params[:comment] == ""
        @message = "入力してください"
      else
        @freeword = Freeword.new
        @freeword.comment = params[:comment]
        @freeword.target_unit = params[:target_unit]
        @freeword.target_review_type = params[:target_review_type]
        @freeword.record_date = Date.parse(params[:record_date])
        @freeword.save
      end
    end
    render 'show', formats: 'json', handlers:'jbuilder'
  end

  private
    def freeword_params
      params.permit(:id, :user_id, :comment, :target_unit, :target_review_type, :record_date)
    end
end

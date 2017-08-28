class Api::V1::FreewordsController < ApplicationController
  def index
    @data = Freeword.find_by(
      user_id: current_user.id,
      record_date: Time.zone.parse(params[:record_date]),
      target_unit: params[:target_unit],
      target_review_type: params[:target_review_type])
    if @data.present?
      logger.debug("id:" + @data.id.to_s)
      logger.debug("comment:" + @data.comment)
    end

    render 'index', formats: 'json', handlers: 'jbuilder'
  end

  def create
    @freeword = nil
    @message = nil
    if (@freeword = Freeword.find_by(
        user_id: current_user.id,
        target_unit: params[:target_unit],
        target_review_type: params[:target_review_type],
        record_date: Date.parse(params[:record_date])
      ))
      @freeword.comment = params[:comment]
      @freeword.save
    else
      if params[:comment] == ""
        @message = "入力してください"
      else
        @freeword = Freeword.new
        @freeword.user_id = current_user.id
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

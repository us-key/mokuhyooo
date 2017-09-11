class Api::V1::DateTargetHeadersController < ApplicationController
  def index
    @qt = QuantitativeTarget.where(user_id: current_user.id)
    if @qt.present?
      @qt = @qt.order("sort_order")
    end
    render 'index', formats: 'json', handlers: 'jbuilder'
  end

  def create
    if params[:mode] == "U"
      @qt = QuantitativeTarget.find_by(
        user_id: current_user.id,
        sort_order: params[:sort_order]
      )
    else
      @qt = QuantitativeTarget.new
      # 登録時のみ設定し、以降変更しない項目
      @qt.user_id = current_user.id
      @qt.quantity_kind = params[:quantity_kind]
      # TODO ソート順：いったん既存の最大+1を登録
      temp_qt = QuantitativeTarget.where(user_id: current_user.id)
      @qt.sort_order = 1 + (temp_qt.present? ? temp_qt.maximum('sort_order') : 1)
    end
    @qt.name = params[:name]
    @qt.target_type = params[:target_type]
    @qt.default_zero_flg = params[:default_zero_flg]
    @qt.start_date = Date.strptime(params[:start_date], '%Y/%m/%d')
    @qt.end_date = Date.strptime(params[:end_date], '%Y/%m/%d')
    @qt.target_value = params[:target_value]
    @qt.save

    render 'show', formats: 'json', handlers: 'jbuilder'
  end

  def get
    @qt = QuantitativeTarget.find_by(
      user_id: current_user.id,
      sort_order: params[:sort_order]
    )
    render 'get', formats: 'json', handlers: 'jbuilder'
  end
end

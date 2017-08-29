class Api::V1::DateTargetHeadersController < ApplicationController
  def index
    @qt = QuantitativeTarget.where(user_id: current_user.id)
    if @qt.present?
      @qt = @qt.order("sort_order")
    end
    render 'index', formats: 'json', handlers: 'jbuilder'
  end

  def create
    @qt = QuantitativeTarget.new
    @qt.user_id = current_user.id
    @qt.name = params[:name]
    @qt.target_type = params[:target_type]
    @qt.quantity_kind = params[:quantity_kind]
    # TODO ソート順：いったん既存の最大+1を登録
    temp_qt = QuantitativeTarget.where(user_id: current_user.id)
    @qt.sort_order = 1 + (temp_qt.present? ? temp_qt.maximum('sort_order') : 1)
    @qt.default_zero_flg = params[:default_zero_flg]
    # TODO 項目色々足りない
    @qt.save

    render 'show', formats: 'json', handlers: 'jbuilder'
  end
end

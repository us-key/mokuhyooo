class Api::V1::DateTargetHeadersController < ApplicationController
  def index
    # TODO ログインユーザーのレコードを取得するよう絞る
    @qt = QuantitativeTarget.all.order("sort_order")
    render 'index', formats: 'json', handlers: 'jbuilder'
  end

  def create
    @QT = QuantitativeTarget.new
    # TODO ユーザーIDの登録
    @QT.name = params[:name]
    @QT.target_type = params[:target_type]
    @QT.quantity_kind = params[:quantity_kind]
    # TODO ソート順：いったん既存の最大+1を登録、ユーザーIDで絞る必要あり
    @QT.sort_order = QuantitativeTarget.maximum('sort_order') + 1
    # TODO 項目色々足りない
    @QT.save

    render 'show', formats: 'json', handlers: 'jbuilder'
  end
end

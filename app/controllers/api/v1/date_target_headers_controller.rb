class Api::V1::DateTargetHeadersController < ApplicationController
  def index
    # TODO ログインユーザーのレコードを取得するよう絞る
    @qt = QuantitativeTarget.all.order("sort_order")
    render 'index', formats: 'json', handlers: 'jbuilder'
  end

  def create
  end
end

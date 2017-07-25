class Api::V1::DateTargetsController < ApplicationController
  # パラメータで渡されたtarget_dateを元にその日のフリーワード目標・振り返り、
  # 数値目標を取得し、jsonに詰めて返却する
  def index
    render 'index', formats: 'json', handlers: 'jbuilder'
  end

  def create
  end

  private
    def date_target_params
    end
end

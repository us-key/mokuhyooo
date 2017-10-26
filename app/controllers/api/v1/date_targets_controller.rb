class Api::V1::DateTargetsController < ApplicationController
  # パラメータで渡されたtarget_dateを元にその日のフリーワード目標・振り返り、
  # 数値目標を取得し、jsonに詰めて返却する
  def index
    # 目標
    @target = Freeword.find_by(
      user_id: current_user.id,
      record_date: params[:target_date],
      target_unit: "D",
      target_review_type: "T"
    )
    # 振返り
    @review = Freeword.find_by(
      user_id: current_user.id,
      record_date: params[:target_date],
      target_unit: "D",
      target_review_type: "R"
    )
    # 数値目標に実績を外部結合
    @qu_pfm = QuantitativeTarget.where(user_id: current_user.id).joins(
      "LEFT OUTER JOIN quantitative_performances ON quantitative_targets.id = quantitative_performances.quantitative_target_id
                       and quantitative_performances.performance_date = '#{Date.strptime(params[:target_date], '%Y/%m/%d')}'"
      ).select("quantitative_targets.*,
                quantitative_performances.id qp_id,
                quantitative_performances.performance_value"
      )
    if @qu_pfm.present?
      @qu_pfm.order("sort_order")
    end

    render 'index', formats: 'json', handlers: 'jbuilder'
  end

  # パラメータで渡されたtarget_date_from/target_date_toを元に目標の集計を行い、
  # jsonに詰めて返却する
  # 合計⇒指定された期間での単純加算、平均⇒default_zero_flg=1の場合、単純平均=0の場合、値がnullのレコードは除外
  def summary
    # 数値目標に実績を外部結合
    qu_pfm = QuantitativeTarget.where(user_id: current_user.id).joins(
      "LEFT OUTER JOIN quantitative_performances ON quantitative_targets.id = quantitative_performances.quantitative_target_id
                       and quantitative_performances.performance_date >= '#{Date.strptime(params[:target_date_from], '%Y/%m/%d')}'
                       and quantitative_performances.performance_date <= '#{Date.strptime(params[:target_date_to], '%Y/%m/%d')}'"
      ).select("quantitative_targets.id, quantitative_targets.sort_order, quantitative_targets.sort_order, quantitative_targets.quantity_kind,
                quantitative_performances.performance_value, quantitative_targets.target_value"
      )
    @qu_pfm_percent = {}
    if qu_pfm.present?
      # 目標ごとにグループ
      @qu_pfm_sum = qu_pfm.group(:id,:sort_order,:target_type,:quantity_kind,:target_value).sum(:performance_value)
      # averageの場合、件数でsumを割って平均値を算出する
      # TODO railsでscalaのfilterみたいなことできたっけ？
      @qu_pfm_sum.each do |key, value|
        # 平均の場合、合計値を平均値に置き換える
        if key[2] == "AVE"
          count = qu_pfm.where(id: key[0]).size
          @qu_pfm_sum[key] = value / count
          @qu_pfm_percent[key] = key[4] ? ((@qu_pfm_sum[key].to_f / key[4].to_f)*100).round(1) : 0 #目標値に対する実績のパーセント
        else
          date_cnt = Date.strptime(params[:target_date_to], '%Y/%m/%d') - Date.strptime(params[:target_date_from], '%Y/%m/%d') + 1
          @qu_pfm_percent[key] = key[4] ? (((value / (key[4]*date_cnt)).to_f)*100).round(1) : 0
        end
      end
    end
    render 'summary', formats: 'json', handlers: 'jbuilder'
  end

  # フリーワード(目標・振り返り)、数値目標の実績を登録する
  def create
    if params[:record].present?
      # hashの値でループ
      sort_order = 0
      params[:record].values.each do |rec|
        id = rec["id"]
        val = rec["value"]
        if sort_order <= 1
          # 目標/振返り
          if sort_order == 0
          else
          end
          @comment = nil
          if (@comment = Freeword.find_by(
                user_id: current_user.id,
                target_unit: "D",
                target_review_type: (sort_order == 0 ? "T" : "R"),
                record_date: Date.parse(params[:date])
            ))
            @comment.comment = val
            @comment.save
          else
            if val == ""
              # TODO メッセージ出す？
            else
              @comment = Freeword.new
              @comment.user_id = current_user.id
              @comment.comment = val
              @comment.target_unit = "D"
              # sort_orderで目標/振返りの判別
              @comment.target_review_type = (sort_order == 0 ? "T" : "R")
              @comment.record_date = Date.parse(params[:date])
              @comment.save
            end
          end
        else
          # 数値目標実績
          target = QuantitativeTarget.find_by(
            user_id: current_user.id,
            sort_order: sort_order
            )
          @performance = nil
          if (@performance = QuantitativePerformance.find_by(
                quantitative_target_id: target.id,
                performance_date: Date.parse(params[:date])
            ))
            if val == "" && target.default_zero_flg == "0"
              # ゼロを計算対象としない場合、ブランクで更新された場合は作成済のレコードを消す
              @performance.destroy
            else
              @performance.performance_value = val
              @performance.save
            end
          else
            if val == "" && target.default_zero_flg == "0"
              # TODO メッセージ出す？default_zero_flg=1の場合はゼロで登録
            else
              @performance = QuantitativePerformance.new
              @performance.quantitative_target_id = target.id
              @performance.performance_date = Date.parse(params[:date])
              @performance.performance_value = (0 + val.to_i) # ブランクならゼロで登録
              @performance.save
            end
          end
        end

        sort_order += 1
      end
    end
    render 'show', formats: 'json', handlers: 'jbuilder'

  # エラー処理
  rescue => e
    logger.error(e)
    @message = "登録に失敗しました。"
    render 'show', formats: 'json', handlers: 'jbuilder'
  end

  private
    def date_target_params
      params.permit(:target_date, :date, :record, :target_date_from, :target_date_to)
    end
end

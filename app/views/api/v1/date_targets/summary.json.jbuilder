# 取得した数値目標の集計結果をjson形式で返却する
# 形式：
# {
#   {　keyはソート順。jsonがキーでソートされてしまうのでその対策。
#      数値目標のソート順は2から振るようにする(ダサいけどやむなし…)
#   2: {target_id: 1,  value: 100},
#   3: {target_id: 2,  value: 200}
#   }
# }
#
# 数値目標
@qu_pfm_sum.each do |key, value|
  json.set! key[1] do
    json.target_id key[0]
    json.value value
    json.percent @qu_pfm_percent[key]
  end
end

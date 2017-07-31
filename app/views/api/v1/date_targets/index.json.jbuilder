# 取得したフリーワードの目標・振り返り、数値目標をjson形式で返却する
# 形式：
# {
#   {　keyはソート順。jsonがキーでソートされてしまうのでその対策。
#      0,1は目標/振返り。数値目標のソート順は2から振るようにする(ダサいけどやむなし…)
#   0: {target_id: -1, id: 1, value: "がんばる"},
#   1: {target_id: 0,  id: 2, value: "がんばった"},
#   2: {target_id: 1,  id: 1, value: 100},
#   3: {target_id: 2,  id: 2, value: 200}
#   }
# }
# ⇒クライアント側でIDと列を紐付けるとかしなくていいように、返却時のIDのソートは一定にする
# (数値目標に表示順とか用意すべきか)
# ⇒目標・振り返りと数値目標でIDが被ることがありうるな。。prefixつけるか。
#
json.set! "0" do
  json.target_id "-1"
  json.id @target.present? ? @target.id : ""
  json.value @target.present? ? @target.comment : ""
end
json.set! "1" do
  json.target_id  "0"
  json.id @review.present? ? @review.id : ""
  json.value @review.present? ? @review.comment : ""
end
# 数値目標
@qu_pfm.each do |qp|
  json.set! qp.sort_order do
    json.target_id qp.id
    json.id qp.qp_id.present? ? qp.qp_id : ""
    json.value qp.performance_value.present? ? qp.performance_value : ""
  end
end

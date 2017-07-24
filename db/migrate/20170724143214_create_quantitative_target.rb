class CreateQuantitativeTarget < ActiveRecord::Migration[5.0]
  def change
    create_table :quantitative_targets do |t|
      t.integer :user_id
      t.date :start_date
      t.date :end_date #新規作成時には年の最終日をデフォルトでセットする
      t.string :target_type #SUM:合計、AVE:平均
      t.string :quantity_kind #QU:数量、TI:時間、TD:時刻
      t.string :default_zero_flg #入力がない場合にゼロとみなし平均を出す

      t.timestamps
    end
  end
end

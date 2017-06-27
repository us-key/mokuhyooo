class CreateFreewords < ActiveRecord::Migration[5.0]
  def change
    create_table :freewords do |t|
      t.integer :user_id
      t.text :comment
      t.string :target_unit #Y:年/M:月/W:週/D:日
      t.string :target_review_type #T:目標(Target)/R:振返り(Review)
      t.date :record_date #年・月・週の場合はそれぞれの初日を設定

      t.timestamps
    end
  end
end

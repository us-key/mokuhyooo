class CreateQuantitativePerformance < ActiveRecord::Migration[5.0]
  def change
    create_table :quantitative_performances do |t|
      t.integer :target_id
      t.date :performance_date
      t.integer :performance_value
    end
  end
end

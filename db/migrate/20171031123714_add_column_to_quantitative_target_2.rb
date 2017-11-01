class AddColumnToQuantitativeTarget2 < ActiveRecord::Migration[5.0]
  def change
    add_column :quantitative_targets, :decimal_flg, :string, default: "0"
  end
end

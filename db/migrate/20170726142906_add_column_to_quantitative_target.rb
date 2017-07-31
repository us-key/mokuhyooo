class AddColumnToQuantitativeTarget < ActiveRecord::Migration[5.0]
  def change
    add_column :quantitative_targets, :sort_order, :integer
  end
end

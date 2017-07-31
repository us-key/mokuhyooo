class AddColumnToQuantitativeTargets < ActiveRecord::Migration[5.0]
  def change
    add_column :quantitative_targets, :name, :string
  end
end

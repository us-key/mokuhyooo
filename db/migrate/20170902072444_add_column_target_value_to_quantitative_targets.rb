class AddColumnTargetValueToQuantitativeTargets < ActiveRecord::Migration[5.0]
  def change
    add_column :quantitative_targets, :target_value, :integer
  end
end

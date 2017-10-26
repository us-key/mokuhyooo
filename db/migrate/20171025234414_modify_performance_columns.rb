class ModifyPerformanceColumns < ActiveRecord::Migration[5.0]
  def change
    change_column :quantitative_performances, :performance_value, :decimal, precision: 7, scale: 2
    change_column :quantitative_targets, :target_value, :decimal, precision: 7, scale: 2
  end

end

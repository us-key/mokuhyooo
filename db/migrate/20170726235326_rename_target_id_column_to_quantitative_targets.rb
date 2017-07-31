class RenameTargetIdColumnToQuantitativeTargets < ActiveRecord::Migration[5.0]
  def change
    rename_column :quantitative_performances, :target_id, :quantitative_target_id
  end
end

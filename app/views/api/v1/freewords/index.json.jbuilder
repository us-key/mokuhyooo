if @data.present?
  json.extract!(@data, :id, :comment)
end

@qt.each do |qt|
  json.set! qt.sort_order do
    json.qt_id qt.id
    json.name qt.name
    json.type qt.target_type
    json.kind qt.quantity_kind
    json.zero_flg qt.default_zero_flg
    json.decimal_flg qt.decimal_flg
  end
end

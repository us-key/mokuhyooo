if @message.present?
  json.set! :message, @message
else
  json.set! :message, '登録しました'
end

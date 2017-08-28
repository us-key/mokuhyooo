class ApplicationController < ActionController::Base
  #protect_from_forgery with: :exception
  protect_from_forgery with: :null_session

  before_action :authenticate_action
  before_action :configure_permitted_parameters, if: :devise_controller?
  after_action :discard_flash_if_xhr

  protected

    def configure_permitted_parameters
      devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
    end

    def discard_flash_if_xhr
      flash.discard if request.xhr?
    end
  private
  # 各メソッドの前に実行するアクション
  def authenticate_action
    authenticate_user!
  end

end

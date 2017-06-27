Rails.application.routes.draw do

  root 'home#index'

  get 'home/index'

  devise_for :users
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  namespace :api, format: 'json' do
    namespace :v1 do
      resources :freewords
    end
  end
end

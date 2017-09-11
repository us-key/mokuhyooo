Rails.application.routes.draw do

  root 'home#index'

  get 'home/index'

  devise_for :users, :controllers => {
    :registrations => 'users/registrations'
  }
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  namespace :api, format: 'json' do
    namespace :v1 do
      resources :freewords
      resources :date_targets
      get 'date_targets_summary', to: 'date_targets#summary'
      resources :date_target_headers
      get 'date_target_headers_get', to: 'date_target_headers#get'
    end
  end
end

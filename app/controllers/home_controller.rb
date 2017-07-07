class HomeController < ApplicationController
  def index
    @source_date = Date.today
  end
end

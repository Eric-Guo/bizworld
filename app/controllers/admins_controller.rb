class AdminsController < ApplicationController
  # TODO(nnarayen): update stubbed method
  def index
    @partners = Partner.all
  end
end

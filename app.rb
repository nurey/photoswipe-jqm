require 'rubygems'
require 'sinatra'
require 'erb'

Tilt.register 'html.erb', Tilt::ERBTemplate

get '/see' do
  erb :see
end

get '/info' do
  erb :info
end

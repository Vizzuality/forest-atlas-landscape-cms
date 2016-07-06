json.array!(@admin_routes) do |admin_route|
  json.extract! admin_route, :id
  json.url admin_route_url(admin_route, format: :json)
end

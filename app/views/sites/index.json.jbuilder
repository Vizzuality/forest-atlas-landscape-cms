json.array!(@sites) do |site|
  json.extract! site, :id, :domain, :template
  json.url site_url(site, format: :json)
end

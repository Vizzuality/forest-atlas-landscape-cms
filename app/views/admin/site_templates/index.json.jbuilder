json.array!(@site_templates) do |site_template|
  json.extract! site_template, :id
  json.url site_template_url(site_template, format: :json)
end

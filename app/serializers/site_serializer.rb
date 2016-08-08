class SiteSerializer < ActiveModel::Serializer
  attributes :id, :name

  belongs_to :site_template, serializer: SiteTemplateSerializer
end

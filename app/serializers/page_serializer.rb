class PageSerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :url, :parent_id
end

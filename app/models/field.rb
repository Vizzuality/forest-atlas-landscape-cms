# TODO: REMOVE
class Field
  include ActiveModel::Model

  attr_accessor :name, :type, :min, :max, :values

  def initialize(data = {})
    self.attributes = data unless data == {}
  end
end

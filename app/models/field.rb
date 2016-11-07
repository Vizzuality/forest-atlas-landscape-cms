class Field
  include ActiveModel::Model

  def initialize(data = {})
    self.attributes = data unless data == {}
  end

  def attributes=(data)
    @name = data.keys.first
    @type = data.values['type']
  end

  attr_accessor :name, :type
end

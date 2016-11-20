class Field
  include ActiveModel::Model

  def initialize(data = {})
    self.attributes = data unless data == {}
  end

  def attributes=(data)
    # TODO: The API is returning different data for this ...
    # ... and it should be uniform
    if data.is_a? Hash
      @name = data.keys.first
      @type = data.values.first['type']
    else
      @name = data.first
      @type = data.last['type']
    end
  end

  attr_accessor :name, :type
end

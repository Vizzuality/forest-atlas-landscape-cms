=begin
 Type of ESRI fields:
      :esriFieldTypeInteger,
      :esriFieldTypeSmallInteger,
      :esriFieldTypeDouble,
      :esriFieldTypeSingle,
      :esriFieldTypeString,
      :esriFieldTypeDate,
      :esriFieldTypeGeometry,
      :esriFieldTypeOID,
      :esriFieldTypeBlob,
      :esriFieldTypeGlobalID,
      :esriFieldTypeRaster,
      :esriFieldTypeGUID,
      :esriFieldTypeXML
=end

module DatasetFieldsHelper
  INT_FIELDS = %w[number float long double esrifieldtypeinteger esrifieldtypesmallinteger esrifieldtypedouble]
  STRING_FIELDS = %w[string esrifieldtypestring esrifieldtypexml text]
  DATE_FIELDS =  %w[date esrifieldtypedate]

  def self.is_number?(val)
    return false unless val.is_a? String
    INT_FIELDS.include?(val.downcase)
  end

  def self.is_date?(val)
    return false unless val.is_a? String
    DATE_FIELDS.include?(val.downcase)
  end

  def self.is_string?(val)
    return false unless val.is_a? String
    STRING_FIELDS.include?(val.downcase)
  end

  def self.is_enumerable?(val)
    is_number?(val) || is_date?(val)
  end

  def self.is_valid?(val)
    is_date?(val) || is_number?(val) || is_string?(val)
  end

  def self.parse(val)
    return 'number' if is_number?(val)
    return 'date'   if is_date?(val)
    return 'string' if is_string?(val)
  end

end

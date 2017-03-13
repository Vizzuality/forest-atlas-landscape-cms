module DatasetFieldsHelper
  INT_FIELDS = %w[number long double esrifieldtypeinteger esrifieldtypesmallinteger esrifieldtypedouble]
  STRING_FIELDS = %w[string esrifieldtypestring esrifieldtypexml]
  DATE_FIELDS =  %w[date esrifieldtypedate]
  def get_numeric_fields
    [:number, :date, :long, :double]
  end

  def get_string_fields
  end

  def get_date_fields
    [:date]
  end

  def get_esri_fields
    [
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
      :esriFieldTypeXML,
    ]
  end
end

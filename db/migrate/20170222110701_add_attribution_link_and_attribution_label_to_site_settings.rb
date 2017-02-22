class AddAttributionLinkAndAttributionLabelToSiteSettings < ActiveRecord::Migration[5.0]
  def change
  	add_column :site_settings, :attribution_link, :text
  	add_column :site_settings, :attribution_label, :text
  end
end

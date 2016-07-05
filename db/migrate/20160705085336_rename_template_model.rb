class RenameTemplateModel < ActiveRecord::Migration[5.0]
  def change
    rename_table :site_templates, :site_templates
    rename_column :sites, :template_id, :site_template_id
  end
end

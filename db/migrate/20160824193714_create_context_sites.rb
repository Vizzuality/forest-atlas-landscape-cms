class CreateContextSites < ActiveRecord::Migration[5.0]
  def change
    create_table :context_sites do |t|
      t.boolean :is_site_default_context

      t.belongs_to :context, index: true
      t.belongs_to :site, index: true

      t.timestamps
    end
  end
end

class CreateTemplates < ActiveRecord::Migration[5.0]
  def change
    create_table :site_templates do |t|
      t.string :name

      t.timestamps
    end
  end
end

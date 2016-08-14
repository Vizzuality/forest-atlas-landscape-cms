class CreateSites < ActiveRecord::Migration[5.0]
  def change
    create_table :sites do |t|
      t.belongs_to :site_template, index: true

      t.string :name

      t.timestamps
    end
  end
end

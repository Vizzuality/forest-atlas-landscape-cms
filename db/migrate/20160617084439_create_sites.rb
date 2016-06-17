class CreateSites < ActiveRecord::Migration[5.0]
  def change
    create_table :sites do |t|
      t.belongs_to :template, index: true

      t.string :domain

      t.timestamps
    end
  end
end

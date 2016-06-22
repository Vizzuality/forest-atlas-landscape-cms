class CreateRoutes < ActiveRecord::Migration[5.0]
  def change
    create_table :routes do |t|
      t.belongs_to :site, index: true

      t.string :host
      t.string :path
      t.integer :site_id

      t.timestamps
    end
  end
end

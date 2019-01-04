class CreateMapVersions < ActiveRecord::Migration[5.0]
  def change
    create_table :map_versions do |t|
      t.string :version, null: false, unique: true
      t.integer :position
      t.string :description

      t.index :version
      t.timestamps
    end
  end
end

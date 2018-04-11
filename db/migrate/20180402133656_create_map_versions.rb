class CreateMapVersions < ActiveRecord::Migration[5.0]
  def change
    create_table :map_versions do |t|
      t.string :version, null: false, unique: true
      t.integer :position
      t.string :description

      t.index :version
      t.timestamps
    end

    MapVersion.create(version: '1.1.11', position: 1)
    MapVersion.create(version: '1.1.12', position: 2)
    MapVersion.create(version: '1.1.15', position: 3)

  end
end

class CreateTags < ActiveRecord::Migration[5.0]
  def change
    create_table :tags do |t|
      t.string :value, null: false
      t.integer :page_id, null: false

      t.foreign_key :pages

      t.timestamps
    end
  end
end

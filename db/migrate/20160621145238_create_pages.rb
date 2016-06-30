class CreatePages < ActiveRecord::Migration[5.0]
  def change
    create_table :pages do |t|
      t.belongs_to :site, index: true

      t.string :name
      t.string :description
      t.string :uri
      t.string :url
      t.string :ancestry

      t.timestamps
    end

    add_index :pages, :ancestry
  end
end

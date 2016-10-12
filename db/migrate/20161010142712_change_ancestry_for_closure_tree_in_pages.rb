class ChangeAncestryForClosureTreeInPages < ActiveRecord::Migration[5.0]
  def change
    add_column :pages, :parent_id, :int
    add_column :pages, :position, :int

    remove_index :pages, column: :ancestry
    remove_column :pages, :ancestry, :string

  end
end

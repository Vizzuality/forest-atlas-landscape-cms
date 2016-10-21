class CreateContextUsers < ActiveRecord::Migration[5.0]
  def change
    create_table :context_users do |t|
      t.boolean :is_context_admin

      t.belongs_to :context, index: true
      t.belongs_to :user, index: true

      t.timestamps
    end
  end
end

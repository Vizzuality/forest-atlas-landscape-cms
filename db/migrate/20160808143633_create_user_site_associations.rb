class CreateUserSiteAssociations < ActiveRecord::Migration[5.0]
  def change
    create_table :user_site_associations do |t|
      t.belongs_to :site, index: true
      t.belongs_to :user, index: true

      t.timestamps
    end
  end
end

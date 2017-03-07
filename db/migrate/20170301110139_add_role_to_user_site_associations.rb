class AddRoleToUserSiteAssociations < ActiveRecord::Migration[5.0]
  def up
    add_column :user_site_associations, :role, :integer, default: UserType::PUBLISHER
    # There are no foreign key constraints on the table.
    # That means there could be anything in there - cleanup first.
    execute <<-SQL
    WITH bogus_sites AS (
      SELECT user_site_associations.id
      FROM user_site_associations
      LEFT JOIN sites ON site_id = sites.id
      WHERE sites.id IS NULL
    )
    UPDATE user_site_associations
    SET site_id = NULL
    FROM bogus_sites
    WHERE user_site_associations.id = bogus_sites.id;
    SQL
    execute <<-SQL
    WITH bogus_users AS (
      SELECT user_site_associations.id
      FROM user_site_associations
      LEFT JOIN users ON user_id = users.id
      WHERE users.id IS NULL
    )
    UPDATE user_site_associations
    SET user_id = NULL
    FROM bogus_users
    WHERE user_site_associations.id = bogus_users.id;
    SQL

    # Foreign keys next.
    add_foreign_key :user_site_associations, :users
    add_foreign_key :user_site_associations, :sites

    # Finally, populate role accordingly
    User.all.each do |user|
      usa_role = if user.role == UserType::ADMIN
        UserType::MANAGER
      else
        user.role
      end
      user.user_site_associations.update_all(role: usa_role)
    end

    # And now for any leftovers.
    UserSiteAssociation.where(role: nil).update_all(role: UserType::PUBLISHER)
  end

  def down
    remove_column :user_site_associations, :role
    remove_foreign_key :user_site_associations, :users
    remove_foreign_key :user_site_associations, :sites
  end
end

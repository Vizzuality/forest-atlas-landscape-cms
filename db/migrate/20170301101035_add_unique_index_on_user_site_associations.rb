class AddUniqueIndexOnUserSiteAssociations < ActiveRecord::Migration[5.0]
  def up
    # Remove any duplicates first
    execute <<-SQL
      WITH duplicates AS (
        SELECT min_id, dup_id FROM (
          SELECT min_id, UNNEST(duplicated_ids) AS dup_id FROM (
            SELECT MIN(id) AS min_id, ARRAY_AGG(id) AS duplicated_ids, COUNT(*)
            FROM user_site_associations
            GROUP BY user_id, site_id
            HAVING COUNT(*) > 1
          ) s
        ) ss
        WHERE ss.dup_id != ss.min_id
      )
      DELETE FROM user_site_associations
      USING duplicates
      WHERE user_site_associations.id = duplicates.dup_id
      SQL

    # Now for the index
    add_index(
      :user_site_associations,
      [:user_id, :site_id],
      unique: true,
      name: :index_user_site_assiciations_on_user_id_and_site_id
    )
  end
end

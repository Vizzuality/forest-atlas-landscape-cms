class ConvertPageTypeToInt < ActiveRecord::Migration[5.0]
  def up
    execute 'ALTER TABLE pages ALTER COLUMN content_type TYPE integer USING (content_type::integer)'
  end

  def down
    execute 'ALTER TABLE pages ALTER COLUMN content_type TYPE text USING (content_type::text)'
  end
end

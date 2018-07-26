class ChangeDashboardVersionToPageVersionInSitePages < ActiveRecord::Migration[5.0]
  def change
    rename_column :pages, :dashboard_version, :page_version
  end
end

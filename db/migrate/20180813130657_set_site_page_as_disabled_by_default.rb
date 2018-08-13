class SetSitePageAsDisabledByDefault < ActiveRecord::Migration[5.0]
  def change
    change_column_default :pages, :enabled, :false
  end
end

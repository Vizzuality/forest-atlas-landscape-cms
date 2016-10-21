class CreateJoinTablePageSiteTemplate < ActiveRecord::Migration[5.0]
  def change
    create_join_table :pages, :site_templates do |t|
      # t.index [:page_id, :site_template_id]
      # t.index [:site_template_id, :page_id]
    end
  end
end

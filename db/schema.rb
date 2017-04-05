# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170329090135) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "context_datasets", force: :cascade do |t|
    t.boolean  "is_confirmed"
    t.boolean  "is_dataset_default_context"
    t.integer  "context_id"
    t.string   "dataset_id"
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
    t.index ["context_id"], name: "index_context_datasets_on_context_id", using: :btree
    t.index ["dataset_id"], name: "index_context_datasets_on_dataset_id", using: :btree
  end

  create_table "context_sites", force: :cascade do |t|
    t.boolean  "is_site_default_context"
    t.integer  "context_id"
    t.integer  "site_id"
    t.datetime "created_at",              null: false
    t.datetime "updated_at",              null: false
    t.index ["context_id"], name: "index_context_sites_on_context_id", using: :btree
    t.index ["site_id"], name: "index_context_sites_on_site_id", using: :btree
  end

  create_table "context_users", force: :cascade do |t|
    t.boolean  "is_context_admin"
    t.integer  "context_id"
    t.integer  "user_id"
    t.datetime "created_at",                   null: false
    t.datetime "updated_at",                   null: false
    t.integer  "role",             default: 1
    t.index ["context_id"], name: "index_context_users_on_context_id", using: :btree
    t.index ["user_id"], name: "index_context_users_on_user_id", using: :btree
  end

  create_table "contexts", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "dataset_settings", force: :cascade do |t|
    t.integer "site_page_id"
    t.integer "context_id"
    t.string  "dataset_id",           null: false
    t.json    "filters"
    t.json    "columns_visible"
    t.json    "columns_changeable"
    t.string  "api_table_name"
    t.string  "fields_last_modified"
    t.json    "legend"
    t.json    "widgets"
    t.index ["context_id"], name: "index_dataset_settings_on_context_id", using: :btree
    t.index ["site_page_id"], name: "index_dataset_settings_on_site_page_id", using: :btree
  end

  create_table "page_hierarchies", id: false, force: :cascade do |t|
    t.integer "ancestor_id",   null: false
    t.integer "descendant_id", null: false
    t.integer "generations",   null: false
    t.index ["ancestor_id", "descendant_id", "generations"], name: "page_anc_desc_idx", unique: true, using: :btree
    t.index ["descendant_id"], name: "page_desc_idx", using: :btree
  end

  create_table "page_widgets", force: :cascade do |t|
    t.integer "page_id"
    t.integer "widget_id"
    t.index ["page_id"], name: "index_page_widgets_on_page_id", using: :btree
    t.index ["widget_id"], name: "index_page_widgets_on_widget_id", using: :btree
  end

  create_table "pages", force: :cascade do |t|
    t.integer  "site_id"
    t.string   "name"
    t.string   "description"
    t.string   "uri"
    t.string   "url"
    t.datetime "created_at",                  null: false
    t.datetime "updated_at",                  null: false
    t.integer  "content_type"
    t.text     "type"
    t.boolean  "enabled"
    t.integer  "parent_id"
    t.integer  "position"
    t.json     "content"
    t.boolean  "show_on_menu", default: true
    t.index ["site_id"], name: "index_pages_on_site_id", using: :btree
  end

  create_table "pages_site_templates", id: false, force: :cascade do |t|
    t.integer "page_id",          null: false
    t.integer "site_template_id", null: false
  end

  create_table "routes", force: :cascade do |t|
    t.integer  "site_id"
    t.string   "host"
    t.string   "path"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["site_id"], name: "index_routes_on_site_id", using: :btree
  end

  create_table "sessions", force: :cascade do |t|
    t.string   "session_id", null: false
    t.text     "data"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["session_id"], name: "index_sessions_on_session_id", unique: true, using: :btree
    t.index ["updated_at"], name: "index_sessions_on_updated_at", using: :btree
  end

  create_table "site_settings", force: :cascade do |t|
    t.integer  "site_id"
    t.string   "name",               null: false
    t.string   "value"
    t.integer  "position",           null: false
    t.string   "image_file_name"
    t.string   "image_content_type"
    t.integer  "image_file_size"
    t.datetime "image_updated_at"
    t.datetime "created_at",         null: false
    t.datetime "updated_at",         null: false
    t.text     "attribution_link"
    t.text     "attribution_label"
    t.index ["site_id", "name"], name: "index_site_settings_on_site_id_and_name", unique: true, using: :btree
    t.index ["site_id"], name: "index_site_settings_on_site_id", using: :btree
  end

  create_table "site_templates", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "sites", force: :cascade do |t|
    t.integer  "site_template_id"
    t.string   "name"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
    t.text     "slug"
    t.index ["site_template_id"], name: "index_sites_on_site_template_id", using: :btree
  end

  create_table "user_site_associations", force: :cascade do |t|
    t.integer  "site_id"
    t.integer  "user_id"
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
    t.integer  "role",       default: 3
    t.index ["site_id"], name: "index_user_site_associations_on_site_id", using: :btree
    t.index ["user_id", "site_id"], name: "index_user_site_assiciations_on_user_id_and_site_id", unique: true, using: :btree
    t.index ["user_id"], name: "index_user_site_associations_on_user_id", using: :btree
  end

  create_table "users", force: :cascade do |t|
    t.string   "email",                  default: "",    null: false
    t.string   "encrypted_password",     default: "",    null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,     null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet     "current_sign_in_ip"
    t.inet     "last_sign_in_ip"
    t.datetime "created_at",                             null: false
    t.datetime "updated_at",                             null: false
    t.string   "name"
    t.boolean  "admin",                  default: false
    t.index ["email"], name: "index_users_on_email", unique: true, using: :btree
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree
  end

  create_table "widgets", force: :cascade do |t|
    t.string   "dataset_id"
    t.string   "api_table_name"
    t.json     "filters"
    t.string   "visualization"
    t.datetime "fields_last_modified"
    t.json     "legend"
    t.json     "columns"
    t.string   "name"
    t.string   "description"
  end

  add_foreign_key "page_widgets", "pages"
  add_foreign_key "page_widgets", "widgets"
  add_foreign_key "user_site_associations", "sites"
  add_foreign_key "user_site_associations", "users"
end

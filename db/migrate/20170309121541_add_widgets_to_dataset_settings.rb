class AddWidgetsToDatasetSettings < ActiveRecord::Migration[5.0]
  def change
    add_column :dataset_settings, :widgets, :json
    DatasetSetting.all.each do |ds|
      map = if ds.default_map.present?
        widget = JSON.parse(ds.default_map)
        puts widget.inspect
        widget['type'] = 'map'
        lon = widget.delete('lon')
        widget['lng'] = lon if lon
        widget['lat'] ||= nil
        widget['zoom'] ||= nil
        widget
      end
      graphs = if ds.default_graphs.present?
        widgets = JSON.parse(ds.default_graphs)
        widgets.map do |widget|
          puts widget.inspect
          widget['chart'] = widget['type'] # 'pie' etc
          widget['type'] = 'chart'
          widget['x'] ||= nil
          widget['y'] ||= nil
          widget
        end
      end
      ds.widgets = ([map] + graphs).compact
      puts ds.widgets.inspect
      ds.save
    end
  end
end

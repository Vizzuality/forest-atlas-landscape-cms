namespace :widgets do
  desc 'Add privateName, citation and allowDownload metadata fields to the existing widgets'
  task update_metadata: :environment do
    update_widgets_metadata(recover_widgets, %w[private_name citation allow_download])
  end

  desc 'Add privateName metadata field to the existing widgets'
  task update_private_name: :environment do
    update_widgets_metadata(recover_widgets, %w[private_name])
  end

  desc 'Add citation metadata field to the existing widgets'
  task update_citation: :environment do
    update_widgets_metadata(recover_widgets, %w[citation])
  end

  desc 'Add allowDownload metadata field to the existing widgets'
  task update_allow_download: :environment do
    update_widgets_metadata(recover_widgets, %w[allow_download])
  end

  private

  # Get all metadata information
  def recover_widgets
    WidgetService.get_widgets
  end

  def add_metadata_fields(widget, widget_metadata, fields=%w[private_name citation allow_download])
    fields.each { |field| send("add_#{field}", widget, widget_metadata) }

    widget_metadata
  end

  def add_private_name(widget, widget_metadata)
    widget_metadata['info']['privateName'] = widget.name
  end

  def add_citation(_widget, widget_metadata)
    widget_metadata['info']['citation'] = widget_metadata['info']['caption']
    widget_metadata['info'].delete 'caption'
  end

  def add_allow_download(widget, widget_metadata)
    if widget.widget_config.blank? ||
      widget.widget_config['paramsConfig'].blank?
      widget_metadata['info']['allowDownload'] = false # Advanced widgets
    else
      widget_metadata['info']['allowDownload'] = true # Simple widgets
    end
  end

  def update_widgets_metadata(widgets, fields)
    widgets.each do |widget|
      widget_with_metadata = get_metadata widget

      widget_with_metadata.metadata.each do |widget_metadata|
        unless widget_metadata['attributes']['info']
          widget_metadata['attributes']['info'] = {}
        end

        widget_metadata =
          add_metadata_fields(widget, widget_metadata['attributes'], fields)

        save_widget_metadata(widget, widget_metadata)
      end
    end
  end

  def get_metadata(widget)
    widget = WidgetService.widget widget.id

    widget = widget_with_metadata || widget

    widget.metadata = if widget && widget.metadata&.any?
                        widget.metadata
                      else
                        [{'attributes' => Widget::DEFAULT_WIDGET}]
                      end

    widget
  end

  def save_widget_metadata(widget, metadata_params)
    if metadata_params['createdAt'].blank?
      create_widget_metadata(widget, metadata_params)
    else
      update_widget_metadata(widget, metadata_params)
    end
  end

  def create_widget_metadata(widget, metadata_params)
    WidgetService.create_metadata(
      ENV['RW_TOKEN'],
      metadata_params,
      widget.id,
      widget.dataset
    )
  end

  def update_widget_metadata(widget, metadata_params)
    WidgetService.update_metadata(
      ENV['RW_TOKEN'],
      metadata_params,
      widget.dataset,
      widget.id
    )
  end
end

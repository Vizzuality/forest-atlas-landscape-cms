namespace :db do
  namespace :metadata do
    desc 'Updates existing metadatas information'
    task :update => :environment do
      ActiveRecord::Base.transaction do
        begin
          datasets = get_datasets
          datasets.each do |dataset|
            metadata = get_metadata(dataset)
            metadata.each do |md|
              md = md.symbolize_keys

              remove_metadata(md)

              create_metadata(md) if valid_languages[md[:attributes]['language']]
            end
          end
        rescue Exception => e
          Rails.logger.error "Error updating metadata: #{e.inspect}"
          puts "Error updating metadata: #{e.inspect}"
          raise ActiveRecord::Rollback
        end
      end
    end
  end
end

def get_datasets
  DatasetService.get_datasets(status: nil)
end

def get_metadata(dataset)
  metadatas = dataset.get_metadata['data']['attributes']['metadata']
  metadatas.select do |md|
    md['attributes']['application'] == 'forest-atlas' &&
    !valid_languages.values.include?(md['attributes']['language'])
  end
end

def valid_languages
  {
    'spanish' => 'es',
    'Spanish' => 'es',
    'eng' => 'en',
    'english' => 'en',
    'English' => 'en',
    'french' => 'fr',
    'French' => 'fr',
    'georgian' => 'ka',
    'Georgian' => 'ka'
  }
end

def remove_metadata(metadata)
  DatasetService.delete_metadata(
    ENV['RW_TOKEN'],
    metadata[:attributes]['dataset'],
    metadata[:attributes]['application'],
    metadata[:attributes]['language']
  )
end

def create_metadata(metadata)
  valid_language = valid_languages[metadata[:attributes]['language']]
  metadata[:language] = valid_language
  metadata[:attributes]['language'] = valid_language

  DatasetService.create_metadata(
    ENV['RW_TOKEN'],
    metadata[:attributes]['dataset'],
    metadata[:attributes]['application'],
    metadata[:attributes]['name'],
    metadata[:attributes]['applicationProperties']['tags'],
    metadata[:attributes].symbolize_keys
  )
end

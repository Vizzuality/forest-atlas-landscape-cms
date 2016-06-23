class RouteMapper

  def initialize
    @tag_cache = {}
    @key_cache = {}
  end

  def write(object, tags)
    key = 'route/'+ object.constraints[:host] + object.path
    Rails.cache.write key, object

    @key_cache[key] = [] unless @key_cache.has_key? key

    tags.each do |tag|
      @tag_cache[tag] = [] unless @tag_cache.has_key? tag
      @tag_cache[tag] << key
      @key_cache[key] << tag
    end
  end

  def fetch(tags)
    tags = [tags] if tags.is_a? String

    keys = []
    tags.each do |tag|
      keys += @tag_cache[tag] if @tag_cache.has_key? tag
    end

    Rails.cache.fetch_multi keys.uniq
  end

  def remove(tags)
    tags = [tags] if tags.is_a? String

    keys = []
    tags.each do |tag|
      keys += @tag_cache[tag] if @tag_cache.has_key? tag
      @tag_cache.delete tag
    end

    keys.uniq.each do |key|
      Rails.cache.delete key
      key_tags = @key_cache[key]
      key_tags.delete(key) if key_tags.include? key
      @key_cache[key] = key_tags

      @key_cache.delete(key) if key_tags.blank?

    end
  end

  def dump_routes
    @key_cache.each do |key, tags|
      puts 'Key: ' + key.to_s
      puts 'Tags: ' + tags.join(', ')
      puts 'Route path: ' + Rails.cache.fetch(key).path
      puts ''
    end
  end

  def dump_tags
    @tag_cache.each do |tag, keys|
      puts 'Tag: ' + tag
      puts 'Keys: ' + keys.join(', ')
      routes = []
      keys.each do |key|
        routes << Rails.cache.fetch(key).path
      end
      puts 'Routes path: ' + routes.join(', ')
      puts ''
    end
  end
end

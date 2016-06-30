class TaggedCache

  def initialize(key_proc = Proc.new { |obj| obj.hash })
    @tag_cache = {}
    @key_proc = key_proc
  end

  def write(object, tags)
    key = @key_proc.call(object)

    return if tags.empty?

    Rails.cache.write key, object

    tags.each do |tag|
      @tag_cache[tag] = [] unless @tag_cache.has_key? tag
      @tag_cache[tag] << key
    end
  end

  def fetch(tags)
    tags = [tags] if tags.is_a? String

    keys = []
    tags.each do |tag|
      keys += @tag_cache[tag] if @tag_cache.has_key? tag
    end

    return [] if keys.empty?

    Rails.cache.fetch_multi(*keys.uniq)
  end

  def remove(tags)
    tags = [tags] if tags.is_a? String

    keys = []
    tags.each do |tag|
      next unless @tag_cache.key? tag
      keys += @tag_cache[tag]
      @tag_cache.delete tag
    end

    @tag_cache.each do |tag, tag_keys|
      @tag_cache[tag] = tag_keys - keys
      @tag_cache.delete(tag) if tag_keys.empty?
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

  def all
    routes = {}
    @tag_cache.each_value do |keys|
      keys_routes = Rails.cache.fetch_multi(*keys) { nil }
      routes.merge! keys_routes
    end
    routes.values
  end

  def empty?
    @tag_cache.empty?
  end
end

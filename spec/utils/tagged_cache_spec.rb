require 'rails_helper'

RSpec.describe TaggedCache do
  before(:each) do
    @tagged_cache = TaggedCache.new()
  end

  it 'Calling write saves data' do
    expect{@tagged_cache.write(Object.new, %w(foo bar))}.to change{@tagged_cache.all.count}.from(0).to(1)
  end

  it 'Calling write without tags does nothing' do
    expect{@tagged_cache.write(Object.new, [])}.not_to change{@tagged_cache.all.count}
  end

  it 'Fetch for tags returns correct data' do
    @tagged_cache.write(Object.new, %w(foo bar))
    @tagged_cache.write(Object.new, %w(bar))

    expect(@tagged_cache.fetch('foo').count).to eql(1)
    expect(@tagged_cache.fetch('bar').count).to eql(2)
    expect(@tagged_cache.fetch('zen')).to be_empty
  end

  it 'Removes data tags returns correct data' do
    @tagged_cache.write(Object.new, %w(foo bar))
    @tagged_cache.write(Object.new, %w(bar zen))

    expect(@tagged_cache.fetch('foo').count).to eql(1)
    expect(@tagged_cache.fetch('bar').count).to eql(2)
    expect(@tagged_cache.fetch('zen').count).to eql(1)

    @tagged_cache.remove('foo')
    expect(@tagged_cache.fetch('foo').count).to eql(0)
    expect(@tagged_cache.fetch('bar').count).to eql(1)
    expect(@tagged_cache.fetch('zen').count).to eql(1)

    @tagged_cache.remove('bar')
    expect(@tagged_cache.fetch('foo').count).to eql(0)
    expect(@tagged_cache.fetch('bar').count).to eql(0)
    expect(@tagged_cache.fetch('zen').count).to eql(0)
  end
end

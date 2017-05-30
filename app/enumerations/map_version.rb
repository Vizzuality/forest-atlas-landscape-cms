class MapVersion < EnumerateIt::Base
  associate_values(
    one_one_ten: %w(1.1.10 1.1.10),
    one_one_eleven: %w(1.1.11 1.1.11),
    one_one_twelve: %w(1.1.12 1.1.12)
  )
end

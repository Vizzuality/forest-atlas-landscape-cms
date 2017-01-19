class UserRole < EnumerateIt::Base
  associate_values(
    owner: [1, 'Owner'],
    writer: [2, 'Writer']
  )
end

class UserType < EnumerateIt::Base
  associate_values(
    admin: [1, 'Admin'],
    publisher: [3, 'Publisher']
  )
end

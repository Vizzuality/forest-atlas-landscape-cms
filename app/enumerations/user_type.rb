class UserType < EnumerateIt::Base
  associate_values(
    admin: [1, 'Admin'],
    manager: [2, 'Manager'],
    publisher: [3, 'Publisher']
  )
end

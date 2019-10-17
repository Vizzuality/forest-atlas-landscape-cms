FactoryBot.define do
  factory :user do

    sequence(:name) { |n| "Test #{('AA'..'ZZ').to_a[n]}" }
    sequence(:email) { |n| "test#{n}@mail.com" }
    encrypted_password { 'password123' }
    admin { true }
  end
end

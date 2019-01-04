# frozen_string_literal: true

every 3.days do
  runner 'TemporaryContentImage.remove_old'
end

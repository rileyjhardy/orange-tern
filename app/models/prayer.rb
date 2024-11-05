class Prayer < ApplicationRecord
  belongs_to :prayer_circle

  has_one_attached :prompt
end

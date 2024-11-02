class PrayerCircle < ApplicationRecord
  has_many :prayers, dependent: :destroy
end

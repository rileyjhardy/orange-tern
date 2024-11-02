class CreatePrayers < ActiveRecord::Migration[8.0]
  def change
    create_table :prayers do |t|
      t.string :name
      t.text :description
      t.integer :duration
      t.references :prayer_circle, null: false, foreign_key: true

      t.timestamps
    end
  end
end

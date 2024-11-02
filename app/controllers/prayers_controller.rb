class PrayersController < ApplicationController
  before_action :set_prayer_circle
  before_action :set_prayer, only: %i[ show edit update destroy ]


  def set_prayer_circle
    @prayer_circle = PrayerCircle.find(params.fetch(:prayer_circle_id))
  end

  # GET /prayers or /prayers.json
  def index
    @prayers = @prayer_circle.prayers
  end

  # GET /prayers/1 or /prayers/1.json
  def show
  end

  # GET /prayers/new
  def new
    @prayer = @prayer_circle.prayers.build
  end

  # GET /prayers/1/edit
  def edit
  end

  # POST /prayers or /prayers.json
  def create
    @prayer = @prayer_circle.prayers.build(prayer_params)

    respond_to do |format|
      if @prayer.save
        format.html { redirect_to prayer_circle_prayers_path(@prayer_circle), notice: "Prayer was successfully created." }
        format.json { render :show, status: :created, location: @prayer }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @prayer.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /prayers/1 or /prayers/1.json
  def update
    respond_to do |format|
      if @prayer.update(prayer_params)
        format.html { redirect_to prayer_circle_prayers_path(@prayer_circle), notice: "Prayer was successfully updated." }
        format.json { render :show, status: :ok, location: @prayer }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @prayer.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /prayers/1 or /prayers/1.json
  def destroy
    @prayer.destroy!

    respond_to do |format|
      format.html { redirect_to prayer_circle_prayers_path(@prayer_circle), status: :see_other, notice: "Prayer was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_prayer
      @prayer = @prayer_circle.prayers.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def prayer_params
      params.expect(prayer: [ :name, :description, :duration, :prayer_circle_id ])
    end
end

class PrayerCirclesController < ApplicationController
  before_action :set_prayer_circle, only: %i[ show edit update destroy ]

  # GET /prayer_circles or /prayer_circles.json
  def index
    @prayer_circles = PrayerCircle.all
  end

  # GET /prayer_circles/1 or /prayer_circles/1.json
  def show
  end

  # GET /prayer_circles/new
  def new
    @prayer_circle = PrayerCircle.new
  end

  # GET /prayer_circles/1/edit
  def edit
  end

  # POST /prayer_circles or /prayer_circles.json
  def create
    @prayer_circle = PrayerCircle.new(prayer_circle_params)

    respond_to do |format|
      if @prayer_circle.save
        format.html { redirect_to @prayer_circle, notice: "Prayer circle was successfully created." }
        format.json { render :show, status: :created, location: @prayer_circle }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @prayer_circle.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /prayer_circles/1 or /prayer_circles/1.json
  def update
    respond_to do |format|
      if @prayer_circle.update(prayer_circle_params)
        format.html { redirect_to @prayer_circle, notice: "Prayer circle was successfully updated." }
        format.json { render :show, status: :ok, location: @prayer_circle }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @prayer_circle.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /prayer_circles/1 or /prayer_circles/1.json
  def destroy
    @prayer_circle.destroy!

    respond_to do |format|
      format.html { redirect_to prayer_circles_path, status: :see_other, notice: "Prayer circle was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_prayer_circle
      @prayer_circle = PrayerCircle.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def prayer_circle_params
      params.expect(prayer_circle: [ :name, :description ])
    end
end

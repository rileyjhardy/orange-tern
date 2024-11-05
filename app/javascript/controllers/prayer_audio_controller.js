import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = {
    prayers: Array
  }

  connect() {
    this.audioElements = this.prayersValue.map(prayer => {
      if (prayer.audio_url) {
        const audio = new Audio(prayer.audio_url)
        audio.preload = 'auto'
        return audio
      }
      return null
    })
  }

  playSegment(event) {
    const { segmentIndex } = event.detail
    if (this.audioElements[segmentIndex]) {
      this.audioElements[segmentIndex].play()
    }
  }

  disconnect() {
    if (this.audioElements) {
      this.audioElements.forEach(audio => {
        if (audio) {
          audio.pause()
          audio.currentTime = 0
        }
      })
    }
  }
} 
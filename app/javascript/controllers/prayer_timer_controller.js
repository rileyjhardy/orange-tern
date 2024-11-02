import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["timer"]
  static values = {
    prayers: Array,
    totalDuration: Number
  }

  connect() {
    this.setupTimer()
  }

  setupTimer() {
    const svg = this.timerTarget
    const radius = 100
    const center = 110
    
    // Clear existing content
    svg.innerHTML = ''
    
    // Create background circle
    const backgroundCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
    backgroundCircle.setAttribute("cx", center)
    backgroundCircle.setAttribute("cy", center)
    backgroundCircle.setAttribute("r", radius)
    backgroundCircle.classList.add('prayer-timer__background')
    svg.appendChild(backgroundCircle)
    
    // Create segments for each prayer
    let startAngle = 0
    this.prayersValue.forEach((prayer, index) => {
      const percentage = prayer.duration / this.totalDurationValue
      const endAngle = startAngle + (percentage * 360)
      
      const segment = this.createSegment(center, radius, startAngle, endAngle)
      segment.classList.add('prayer-timer__segment')
      segment.style.stroke = `hsl(${(index * 360) / this.prayersValue.length}, 70%, 50%)`
      svg.appendChild(segment)
      
      startAngle = endAngle
    })
    
    // Create progress indicator
    this.progressMarker = document.createElementNS("http://www.w3.org/2000/svg", "circle")
    this.progressMarker.setAttribute("cx", center)
    this.progressMarker.setAttribute("cy", center - radius)
    this.progressMarker.classList.add('prayer-timer__progress-marker')
    svg.appendChild(this.progressMarker)
    
    this.startTimer()
  }

  createSegment(center, radius, startAngle, endAngle) {
    const start = this.polarToCartesian(center, center, radius, startAngle)
    const end = this.polarToCartesian(center, center, radius, endAngle)
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"
    
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
    path.setAttribute("d", [
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 1, end.x, end.y
    ].join(" "))
    path.setAttribute("fill", "none")
    path.setAttribute("stroke-width", "10")
    
    return path
  }

  polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    }
  }

  startTimer() {
    let startTime = Date.now()
    let currentSegmentIndex = -1
    let hasCompleted = false
    
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000
      
      // Check if we've completed one full cycle
      if (elapsed >= this.totalDurationValue && !hasCompleted) {
        hasCompleted = true
        console.log("Prayer cycle completed!")
        return // Stop the animation
      }
      
      // Only continue animation if we haven't completed
      if (!hasCompleted) {
        const percentage = elapsed / this.totalDurationValue
        const angle = percentage * 360
        
        // Calculate which segment we're in
        let elapsedTime = elapsed
        let accumulatedTime = 0
        let newSegmentIndex = 0
        
        for (let i = 0; i < this.prayersValue.length; i++) {
          accumulatedTime += this.prayersValue[i].duration
          if (elapsedTime <= accumulatedTime) {
            newSegmentIndex = i
            break
          }
        }
        
        // Log when we enter a new segment
        if (newSegmentIndex !== currentSegmentIndex) {
          currentSegmentIndex = newSegmentIndex
          console.log(`Entering segment ${currentSegmentIndex + 1} - Prayer duration: ${this.prayersValue[currentSegmentIndex].duration}s`)
        }
        
        const center = 110
        const radius = 100
        const x = center + radius * Math.cos((angle - 90) * Math.PI / 180)
        const y = center + radius * Math.sin((angle - 90) * Math.PI / 180)
        
        this.progressMarker.setAttribute("cx", x)
        this.progressMarker.setAttribute("cy", y)
        
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }
} 
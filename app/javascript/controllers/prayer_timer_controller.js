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
    const circumference = 2 * Math.PI * radius
    const center = 110 // Slightly larger than radius to account for stroke width
    
    // Clear existing content
    svg.innerHTML = ''
    
    // Create background circle
    const backgroundCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
    backgroundCircle.setAttribute("cx", center)
    backgroundCircle.setAttribute("cy", center)
    backgroundCircle.setAttribute("r", radius)
    backgroundCircle.setAttribute("fill", "none")
    backgroundCircle.setAttribute("stroke", "#eee")
    backgroundCircle.setAttribute("stroke-width", "10")
    svg.appendChild(backgroundCircle)
    
    // Create segments for each prayer
    let startAngle = 0
    this.prayersValue.forEach((prayer, index) => {
      const percentage = prayer.duration / this.totalDurationValue
      const endAngle = startAngle + (percentage * 360)
      
      const segment = this.createSegment(center, radius, startAngle, endAngle)
      segment.setAttribute("stroke", `hsl(${(index * 360) / this.prayersValue.length}, 70%, 50%)`)
      svg.appendChild(segment)
      
      startAngle = endAngle
    })
    
    // Create progress indicator
    this.progressMarker = document.createElementNS("http://www.w3.org/2000/svg", "circle")
    this.progressMarker.setAttribute("cx", center)
    this.progressMarker.setAttribute("cy", center - radius)
    this.progressMarker.setAttribute("r", "5")
    this.progressMarker.setAttribute("fill", "white")
    this.progressMarker.setAttribute("stroke", "black")
    this.progressMarker.setAttribute("stroke-width", "2")
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
    
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000
      const percentage = (elapsed % this.totalDurationValue) / this.totalDurationValue
      const angle = percentage * 360
      
      const center = 110
      const radius = 100
      const x = center + radius * Math.cos((angle - 90) * Math.PI / 180)
      const y = center + radius * Math.sin((angle - 90) * Math.PI / 180)
      
      this.progressMarker.setAttribute("cx", x)
      this.progressMarker.setAttribute("cy", y)
      
      requestAnimationFrame(animate)
    }
    
    requestAnimationFrame(animate)
  }
} 
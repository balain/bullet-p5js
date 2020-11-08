const DEFAULT_LABEL = ' '
const DEFAULT_MAX = 100
const DEFAULT_BIN_COUNT = 4
const DEFAULT_WIDTH = 400
const DEFAULT_HEIGHT = 30
const DEFAULT_BAR_HEIGHT = 20
const DEFAULT_FONTSIZE = 12

// TODO: Fix the calc of chart/canvas height & bin label display
const MIN_VALUE_BAR_HEIGHT_FOR_VALUE_LABELS = 10

/**
 * Class to create Bullet chart
 * Requires: p5.js loaded
 */
class Bullet {
  /**
   * Constructor
   * @param {number} value - Value
   * @param {string} label - Text label
   * @param {number} max - Maximum
   * @param {number} binCount - Number of bins (2-5)
   * @param {number} width - Width of the canvas
   * @param {number} height - Height of the canvas
   * @param {number} barHeight - Height of the value bar
   * @param {number} fontSize - Label font size
   * 
   */
  constructor(
    value, 
    label = DEFAULT_LABEL, 
    max = DEFAULT_MAX, 
    binCount = DEFAULT_BIN_COUNT, 
    width = DEFAULT_WIDTH, 
    height = DEFAULT_HEIGHT, 
    barHeight = DEFAULT_BAR_HEIGHT, 
    fontSize = DEFAULT_FONTSIZE) 
    {
    this.buffer = 5  // Horizontal buffer
    this.vbuffer = 3  // Vertical buffer (above/below chart)
    
    this.label = label
    this.value = value
    this.max = max
    this.maxFactor = max/100
    this.canvasWidth = width
    this.canvasHeight = height
    
    this.binCount = binCount
    this.fontSize = fontSize * 1
    this.cx = false
    
    this.textWidth = textWidth(this.label)
    dbg(`textWidth: ${this.textWidth} for label ${this.label}`)
    // Calculate the bounding box of the chart (without text label)
    if (this.textWidth > 0) {
      this.chartX = this.textWidth + (2 * this.buffer)
    } else {
      this.chartX = 0
    }
    dbg(`chartX: ${this.chartX}`)
    
    this.chartY = 0
    this.chartWidth = this.canvasWidth - this.chartX - this.buffer
    this.barHeight = barHeight || this.DEFAULT_BAR_HEIGHT
    this.setHeight(height)

    this.ppp = this.chartWidth / this.max // points per pixel
  }

  /**
   * Show value labels?
   * Should value labels be displayed?
   * Determined by height of chart compared with height of the canvas
   * @returns {boolean} true if there is enough room to display the labels
   */
  _showValueLabels() { 
    dbg(`is ${this.chartHeight} >= ${MIN_VALUE_BAR_HEIGHT_FOR_VALUE_LABELS}?`)
    return (this.chartHeight >= MIN_VALUE_BAR_HEIGHT_FOR_VALUE_LABELS)
  }

  /**
   * P5js standard display() function
   * Note: noloop() is set to prevent refresh
   */
  display() {
    dbg(`fontSize: ${this.fontSize}, ${typeof this.fontSize}, ${textSize()}`)
    textSize(this.fontSize)
    dbg(`textSize = ${textSize()}`)
    // Label
    if (textWidth(this.label) > 0) {  // Only print if there's something to print
      fill(0, 255)
      textAlign(LEFT, TOP)
      text(this.label, this.buffer, this.vbuffer)
    }
    
    // Quantitiatve Bins
    noStroke()
    let shade = 0
    // Create the shaded backgrounds
    for (let i = 0; i < this.binCount; i++) {
      (i === 0) ? textAlign(LEFT, CENTER) : textAlign(CENTER, CENTER)
      shade = ((100 * (i + 1)) / (this.binCount + 1))
      if (shade < 10) { shade *= 10 }
      
      fill(0, shade)
      rect(this.chartX, 0, this.chartWidth - (i * this.chartWidth/this.binCount), this.chartHeight)
      dbg(this.chartHeight, MIN_VALUE_BAR_HEIGHT_FOR_VALUE_LABELS)
      dbg(`showing value labels; chartHeight: ${this.chartHeight}; canvasHeight: ${this.canvasHeight} `)
      if (this._showValueLabels()) {
        // Value label
        fill(0, 255)
        dbg(`in loop: ${i}:
          ${Math.round(this.max*i/this.binCount)} 
          x = ${this.chartX + (i * this.chartWidth/this.binCount)}
          y = ${this.chartHeight + (2 * this.vbuffer)}`)
        text(
          Math.round(this.max*i/this.binCount), 
          this.chartX + (i * this.chartWidth/this.binCount), 
          (this.chartHeight + (2 * this.vbuffer)))
      }
    }
    if (this._showValueLabels()) {
    // Right-most value label
      textAlign(RIGHT, CENTER)
      text(this.max, this.chartX + this.chartWidth, (this.chartHeight + (2 * this.vbuffer)))
    }
    
    // Main Value Bar
    fill(0)
    let bw = this.ppp * this.value
    let bh = this.barHeight
    let bx = this.chartX
    let by = this.chartHeight/2 - bh/2
    rect(bx, by, bw, bh)

    // Cross
    if (this.cx) {
      rect(this.cx, this.cy, this.cw, this.ch)
    }
  }

  /**
   * Add crossbar - optional
   * Bar will be centered at the provided value
   * @param {number} x Location of the crossbar (in pixels)
   */
  addCross(x) {
    this.cw = 5 // this.barHeight
    this.cx = this.chartX + (this.ppp * x) - (this.cw/2)
    this.ch = 0.8 * this.chartHeight //  - (2 * this.vbuffer)
    this.cy = 0.1 * this.chartHeight // this.vbuffer
  }

  /**
   * Get the canvas width
   * @returns {number} Canvas width
   */
  getWidth() { return (this.canvasWidth) }
  
  /**
   * Get the canvas height
   * @returns {number} Canvas height
   */
  getHeight() { return(this.canvasHeight) }

  /**
   * Set the canvas height and re-calculate the bar and bin heights
   * @param {number} h Height of the canvas
   */
  setHeight(h) { 
    dbg(`setHeight(${h}) called...`)
    this.chartHeight = h
    if (this._showValueLabels()) {
      dbg(`do show labels`)
      this.chartHeight = height - (4 * this.vbuffer)
    } else {
      dbg(`don't show labels`)
      this.chartHeight = this.canvasHeight
    }
    dbg(`setting chartHeight to ${this.chartHeight}`)
    this.chartHeight = this.canvasHeight - (4 * this.vbuffer)

    if (this.barHeight > this.chartHeight) {
      this.barHeight = this.chartHeight/3
    }
    dbg(`barHeight: ${this.barHeight}; chartHeight: ${this.chartHeight}`)  
  }
}

/**
 * Print debug message
 * @param {string} msg Debug message
 */
function dbg(msg) {
  if (debug) { console.log(msg) }
}
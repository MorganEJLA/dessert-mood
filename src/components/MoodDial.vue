<template>
  <div class="knob-container">
    <div
      class="knob"
      ref="knob"
      @mousedown="startDrag"
      @touchstart="startDrag"
      :style="{ transform: `rotate(${rotation}deg)` }"
    >
      <div class="dot"></div>
    </div>
    <div class="value">{{ currentValue }}</div>
    <p>{{ label }}</p>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: 'Mood',
    },
    minValue: {
      type: Number,
      default: 0,
    },
    maxValue: {
      type: Number,
      default: 100,
    },
    initialValue: {
      type: Number,
      default: 50,
    },
  },
  data() {
    return {
      isDragging: false,
      startAngle: 0,
      startRotation: 0,
      rotation: 0, // Current rotation in degrees
      currentValue: 0, // Mapped value from min to max
    }
  },
  mounted() {
    // Set initial value and rotation
    this.currentValue = this.initialValue
    this.rotation = this.mapValueToRotation(this.initialValue)
    this.emitValue() // Emit initial value
  },
  methods: {
    startDrag(event) {
      this.isDragging = true
      const knob = this.$refs.knob
      const knobRect = knob.getBoundingClientRect()
      const centerX = knobRect.left + knobRect.width / 2
      const centerY = knobRect.top + knobRect.height / 2

      let clientX, clientY
      if (event.type === 'touchstart') {
        clientX = event.touches[0].clientX
        clientY = event.touches[0].clientY
      } else {
        clientX = event.clientX
        clientY = event.clientY
      }

      this.startAngle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI)
      this.startRotation = this.rotation

      // Add event listeners for mousemove/mouseup or touchmove/touchend
      window.addEventListener('mousemove', this.doDrag)
      window.addEventListener('mouseup', this.stopDrag)
      window.addEventListener('touchmove', this.doDrag)
      window.addEventListener('touchend', this.stopDrag)
    },
    doDrag(event) {
      if (!this.isDragging) return

      const knob = this.$refs.knob
      const knobRect = knob.getBoundingClientRect()
      const centerX = knobRect.left + knobRect.width / 2
      const centerY = knobRect.top + knobRect.height / 2

      let clientX, clientY
      if (event.type === 'touchmove') {
        clientX = event.touches[0].clientX
        clientY = event.touches[0].clientY
      } else {
        clientX = event.clientX
        clientY = event.clientY
      }

      const currentAngle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI)
      let angleDiff = currentAngle - this.startAngle

      // Normalize angleDiff to be between -180 and 180 for smoother rotation
      if (angleDiff > 180) angleDiff -= 360
      if (angleDiff < -180) angleDiff += 360

      let newRotation = this.startRotation + angleDiff

      // Constrain rotation to 0-360 degrees (or 0-270 if you want to limit it like the Codepen example)
      // The Codepen example seems to imply a range of about 270 degrees of rotation (from -135 to +135)
      // Let's map 0-100 value to -135deg to +135deg (270deg total range)
      const minRot = -135
      const maxRot = 135
      newRotation = Math.max(minRot, Math.min(maxRot, newRotation))

      this.rotation = newRotation
      this.currentValue = this.mapRotationToValue(this.rotation)
      this.emitValue()

      event.preventDefault() // Prevent text selection during drag
    },
    stopDrag() {
      this.isDragging = false
      window.removeEventListener('mousemove', this.doDrag)
      window.removeEventListener('mouseup', this.stopDrag)
      window.removeEventListener('touchmove', this.doDrag)
      window.removeEventListener('touchend', this.stopDrag)
    },
    // Map value (0-100) to rotation (-135deg to +135deg)
    mapValueToRotation(value) {
      const valueRange = this.maxValue - this.minValue
      const rotationRange = 270 // From -135 to +135
      return ((value - this.minValue) / valueRange) * rotationRange - 135
    },
    // Map rotation (-135deg to +135deg) to value (0-100)
    mapRotationToValue(rotation) {
      const rotationRange = 270
      const valueRange = this.maxValue - this.minValue
      let value = ((rotation + 135) / rotationRange) * valueRange + this.minValue
      return Math.round(value) // Round to nearest integer
    },
    emitValue() {
      this.$emit('update:value', this.currentValue)
    },
  },
}
</script>

<style scoped>
/* Styles adapted from the Codepen */
.knob-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
  user-select: none; /* Prevent text selection */
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
}

.knob {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(145deg, #2b2b2b, #202020); /* Darker, more metallic */
  box-shadow:
    7px 7px 15px rgba(0, 0, 0, 0.5),
    -7px -7px 15px rgba(50, 50, 50, 0.2);
  display: flex;
  justify-content: center;
  align-items: flex-start; /* Dot at the top */
  cursor: grab;
  position: relative; /* For the dot */
  transition: box-shadow 0.1s ease-out; /* Smooth transition on hover/active */
}

.knob:active {
  cursor: grabbing;
  box-shadow:
    inset 5px 5px 10px rgba(0, 0, 0, 0.7),
    inset -5px -5px 10px rgba(40, 40, 40, 0.3);
}

.dot {
  width: 10px;
  height: 10px;
  background: #ff00ff; /* Vibrant indicator */
  border-radius: 50%;
  position: absolute;
  top: 10px; /* Position it on the top edge */
  box-shadow:
    0 0 5px #ff00ff,
    0 0 10px #ff00ff;
}

.value {
  margin-top: 15px;
  font-size: 1.5em;
  color: #00ffff; /* Another vibrant color */
  font-weight: bold;
}

p {
  margin-top: 5px;
  color: #aaa;
  font-size: 0.9em;
  text-transform: uppercase;
  letter-spacing: 1px;
}
</style>

<template>
  <div id="app">
    <header class="app-header">
      <h1>Start with a flavor. End with a feeling.</h1>
      <p class="tagline">Adjust the dials to find your perfect mood-match dessert and song.</p>
    </header>

    <section class="mood-adjuster-section">
      <h2>Adjust Your Mood</h2>
      <div class="mood-dials">
        <MoodDial
          label="Sweetness"
          :initialValue="moodParams.sweetness"
          @update:value="moodParams.sweetness = $event"
        />
        <MoodDial
          label="Bitterness"
          :initialValue="moodParams.bitterness"
          @update:value="moodParams.bitterness = $event"
        />
        <MoodDial
          label="Warmth"
          :initialValue="moodParams.warmth"
          @update:value="moodParams.warmth = $event"
        />
        <MoodDial
          label="Nostalgia"
          :initialValue="moodParams.nostalgia"
          @update:value="moodParams.nostalgia = $event"
        />
        <MoodDial
          label="Excitement"
          :initialValue="moodParams.excitement"
          @update:value="moodParams.excitement = $event"
        />
      </div>

      <div class="current-mood-summary">
        <h3>Current Mood Profile:</h3>
        <ul>
          <li>Sweetness: {{ moodParams.sweetness }}</li>
          <li>Bitterness: {{ moodParams.bitterness }}</li>
          <li>Warmth: {{ moodParams.warmth }}</li>
          <li>Nostalgia: {{ moodParams.nostalgia }}</li>
          <li>Excitement: {{ moodParams.excitement }}</li>
        </ul>
      </div>
    </section>

    <section class="suggestions-section">
      <h2>Your Cosmic Pair</h2>
      <p>Once you've set your mood, cosmic energies will align to suggest a dessert and a song!</p>
    </section>
  </div>
</template>

<script>
// 1. Import the MoodDial component
import MoodDial from './components/MoodDial.vue'

export default {
  name: 'App',
  // 2. Register the MoodDial component so it can be used in the template
  components: {
    MoodDial,
  },
  // 3. Define the reactive data for our mood parameters
  data() {
    return {
      moodParams: {
        sweetness: 50,
        bitterness: 50,
        warmth: 50,
        nostalgia: 50,
        excitement: 50,
      },
    }
  },
  // We'll add methods or computed properties here later
  // to process moodParams and generate suggestions.
}
</script>

<style>
/* Basic Global Styles (feel free to make this more "cosmic") */
body {
  font-family: 'Arial', sans-serif;
  background: linear-gradient(135deg, #1a0033, #000000); /* Deep space purple to black */
  color: #e0e0e0; /* Light grey text */
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: flex-start; /* Align to top for longer content */
  min-height: 100vh;
  overflow-x: hidden; /* Prevent horizontal scroll */
}

#app {
  width: 100%;
  max-width: 1200px; /* Constrain content width */
  padding: 40px 20px;
  text-align: center;
  box-sizing: border-box; /* Include padding in width calculation */
}

.app-header {
  margin-bottom: 50px;
}

.app-header h1 {
  font-size: 3.5em;
  color: #ffcc00; /* Gold/star-like color */
  text-shadow: 0 0 15px rgba(255, 204, 0, 0.7);
  margin-bottom: 10px;
}

.app-header .tagline {
  font-size: 1.2em;
  color: #a0a0a0;
}

.mood-adjuster-section {
  background: rgba(0, 0, 0, 0.4); /* Semi-transparent dark background */
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 50px;
  box-shadow: 0 0 30px rgba(255, 0, 255, 0.2); /* Pinkish glow */
}

.mood-adjuster-section h2 {
  font-size: 2.5em;
  color: #00ffff; /* Cyan glow */
  margin-bottom: 30px;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
}

.mood-dials {
  display: flex;
  flex-wrap: wrap; /* Allow dials to wrap on smaller screens */
  justify-content: center;
  gap: 30px; /* Space between dials */
  margin-bottom: 40px;
}

.current-mood-summary {
  background: rgba(255, 255, 255, 0.05); /* Very subtle light background */
  border-radius: 10px;
  padding: 20px;
  margin: 0 auto; /* Center the summary */
  max-width: 500px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.current-mood-summary h3 {
  color: #ff66ff; /* Pinkish-purple */
  font-size: 1.4em;
  margin-bottom: 15px;
}

.current-mood-summary ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid; /* Use grid for a neat two-column layout if space allows */
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
}

.current-mood-summary li {
  font-size: 1.1em;
  color: #b0b0b0;
  text-align: left;
}

.suggestions-section {
  padding: 30px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 15px;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.1); /* Greenish glow */
}

.suggestions-section h2 {
  font-size: 2em;
  color: #99ff99; /* Light green */
  margin-bottom: 20px;
}

.suggestions-section p {
  font-style: italic;
  color: #c0c0c0;
}
</style>

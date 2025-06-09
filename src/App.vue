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
      <div class="spotify-auth">
        <button @click="login" v-if="!token">Login with Spotify</button>
        <button @click="getProfile" v-if="token && !profile">Get My Spotify Profile</button>
        <pre v-if="profile">{{ profile }}</pre>
      </div>

      <!-- Step 1: Login Button -->
      <div class="spotify-auth">
        <button @click="login" v-if="!token">Login with Spotify</button>
        <button @click="getProfile" v-if="token && !profile">Get My Spotify Profile</button>
        <pre v-if="profile">{{ profile }}</pre>
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
  <section class="spotify-auth">
    <h2>Spotify Connection Test</h2>
    <button v-if="!token" @click="login">Login with Spotify</button>
    <button v-if="token" @click="getProfile">Get My Spotify Profile</button>

    <div v-if="profile">
      <h3>Spotify User Info:</h3>
      <pre>{{ profile }}</pre>
    </div>
  </section>
</template>
<script>
import MoodDial from './components/MoodDial.vue'
import { generateCodeVerifier, generateCodeChallenge } from './auth'

export default {
  name: 'App',
  components: {
    MoodDial,
  },
  data() {
    return {
      // 🎛 Mood Dial Values
      moodParams: {
        sweetness: 50,
        bitterness: 50,
        warmth: 50,
        nostalgia: 50,
        excitement: 50,
      },

      // 🎵 Spotify Auth & Data
      token: null,
      profile: null,
      clientId: '1602280b57844a7fafc1834758087c42', // replace with real client ID
      redirectUri: 'https://dessertmood.netlify.app/', // replace with your deployed Netlify URL
      scopes: 'user-read-private user-read-email',
    }
  },

  created() {
    this.checkToken()
  },

  methods: {
    // 🚪 Trigger Spotify Login
    async login() {
      const verifier = generateCodeVerifier()
      const challenge = await generateCodeChallenge(verifier)

      localStorage.setItem('code_verifier', verifier)

      const params = new URLSearchParams({
        response_type: 'code',
        client_id: '1602280b57844a7fafc1834758087c42',
        scope: 'user-read-private user-read-email',
        redirect_uri: 'https://dessertmood.netlify.app/',
        code_challenge_method: 'S256',
        code_challenge: challenge,
      })

      window.location = `https://accounts.spotify.com/authorize?${params.toString()}`
    },

    // 🕵️ Get token from URL on callback
    checkToken() {
      const hash = window.location.hash.substring(1)
      const params = new URLSearchParams(hash)
      const accessToken = params.get('access_token')
      if (accessToken) {
        this.token = accessToken
        window.history.replaceState({}, document.title, '/') // clean the URL
      }
    },

    // 🧠 Fetch User Profile (test if token works)
    async getProfile() {
      try {
        const response = await fetch('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        })
        if (!response.ok) throw new Error('Failed to fetch profile')
        this.profile = await response.json()
      } catch (err) {
        alert(`Error: ${err.message}`)
      }
    },
  },
}
</script>

<style>
body {
  font-family: 'Arial', sans-serif;
  background: linear-gradient(135deg, #1a0033, #000000);
  color: #e0e0e0;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  overflow-x: hidden;
}

#app {
  width: 100%;
  max-width: 1200px;
  padding: 40px 20px;
  text-align: center;
  box-sizing: border-box;
}

.app-header {
  margin-bottom: 50px;
}

.app-header h1 {
  font-size: 3.5em;
  color: #ffcc00;
  text-shadow: 0 0 15px rgba(255, 204, 0, 0.7);
  margin-bottom: 10px;
}

.app-header .tagline {
  font-size: 1.2em;
  color: #a0a0a0;
}

.mood-adjuster-section {
  background: rgba(0, 0, 0, 0.4);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 50px;
  box-shadow: 0 0 30px rgba(255, 0, 255, 0.2);
}

.mood-adjuster-section h2 {
  font-size: 2.5em;
  color: #00ffff;
  margin-bottom: 30px;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
}

.mood-dials {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
  margin-bottom: 40px;
}

.current-mood-summary {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 20px;
  margin: 0 auto;
  max-width: 500px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.current-mood-summary h3 {
  color: #ff66ff;
  font-size: 1.4em;
  margin-bottom: 15px;
}

.current-mood-summary ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
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
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.1);
}

.suggestions-section h2 {
  font-size: 2em;
  color: #99ff99;
  margin-bottom: 20px;
}

.suggestions-section p {
  font-style: italic;
  color: #c0c0c0;
}
</style>

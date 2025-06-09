<template>
  <div id="app">
    <header>
      <h1>🎵 Dessert Mood & Spotify PKCE Demo</h1>
      <button v-if="!accessToken" @click="login">Login with Spotify</button>
      <button v-if="accessToken" @click="logout">Logout</button>
    </header>

    <section v-if="profile">
      <h2>Welcome, {{ profile.display_name }}</h2>
      <img :src="profile.images[0]?.url" alt="Profile image" width="100" />
      <p>Email: {{ profile.email }}</p>
    </section>

    <section v-else-if="accessToken">
      <p>Loading profile...</p>
    </section>

    <section v-else>
      <p>Please login to connect with Spotify.</p>
    </section>

    <MoodDial v-if="accessToken" :mood-params="moodParams" />
  </div>
</template>

<script>
import MoodDial from './components/MoodDial.vue'

export default {
  name: 'App',
  components: { MoodDial },
  data() {
    return {
      accessToken: null,
      profile: null,
      moodParams: {
        sweetness: 50,
        bitterness: 50,
        warmth: 50,
        nostalgia: 50,
        excitement: 50,
      },
    }
  },
  created() {
    const storedToken = localStorage.getItem('access_token')
    if (storedToken) {
      this.accessToken = storedToken
      this.getProfile()
    }
  },
  methods: {
    login() {
      const clientId = '1602280b57844a7fafc1834758087c42'
      const redirectUri = 'https://dessertmood.netlify.app/callback'
      const codeVerifier = this.generateCodeVerifier()
      localStorage.setItem('code_verifier', codeVerifier)

      this.generateCodeChallenge(codeVerifier).then(codeChallenge => {
        const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=user-read-private user-read-email&redirect_uri=${encodeURIComponent(
          redirectUri
        )}&code_challenge_method=S256&code_challenge=${codeChallenge}`
        window.location = authUrl
      })
    },
    logout() {
      localStorage.removeItem('access_token')
      this.accessToken = null
      this.profile = null
    },
    async getProfile() {
      try {
        const res = await fetch('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        })
        const data = await res.json()
        this.profile = data
      } catch (err) {
        console.error('Failed to fetch profile:', err)
      }
    },
    generateCodeVerifier() {
      const array = new Uint32Array(56)
      window.crypto.getRandomValues(array)
      return Array.from(array, dec => ('0' + dec.toString(16)).slice(-2)).join('')
    },
    async generateCodeChallenge(codeVerifier) {
      const encoder = new TextEncoder()
      const data = encoder.encode(codeVerifier)
      const digest = await window.crypto.subtle.digest('SHA-256', data)
      return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '')
    },
  },
}
</script>

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
  </div>
</template>

<script>
export default {
  data() {
    return {
      clientId: '1602280b57844a7fafc1834758087c42', // Replace this with your Spotify client ID
      redirectUri: 'https://dessertmood.netlify.app/callback', // Replace with your exact redirect URI
      scopes: 'user-read-private user-read-email',
      codeVerifier: '',
      accessToken: null,
      refreshToken: null,
      profile: null,
    }
  },
  async created() {
    await this.handleRedirect()
  },
  methods: {
    // Generate a random string for code verifier
    generateCodeVerifier() {
      const array = new Uint32Array(56)
      window.crypto.getRandomValues(array)
      return Array.from(array, (dec) => ('0' + dec.toString(16)).slice(-2)).join('')
    },

    // Base64 URL encode
    base64urlencode(str) {
      return btoa(String.fromCharCode.apply(null, new Uint8Array(str)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '')
    },

    // SHA256 hash for code challenge
    async sha256(plain) {
      const encoder = new TextEncoder()
      const data = encoder.encode(plain)
      const hash = await crypto.subtle.digest('SHA-256', data)
      return new Uint8Array(hash)
    },

    async login() {
      this.codeVerifier = this.generateCodeVerifier()
      localStorage.setItem('code_verifier', this.codeVerifier)

      const codeChallenge = this.base64urlencode(await this.sha256(this.codeVerifier))

      const authUrl = new URL('https://accounts.spotify.com/authorize')
      authUrl.searchParams.append('response_type', 'code')
      authUrl.searchParams.append('client_id', this.clientId)
      authUrl.searchParams.append('scope', this.scopes)
      authUrl.searchParams.append('redirect_uri', this.redirectUri)
      authUrl.searchParams.append('code_challenge_method', 'S256')
      authUrl.searchParams.append('code_challenge', codeChallenge)

      window.location = authUrl.toString()
    },

    async handleRedirect() {
      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.get('code')
      if (!code) return // no code, no auth

      this.codeVerifier = localStorage.getItem('code_verifier')
      if (!this.codeVerifier) {
        alert('No code verifier found, please login again.')
        return
      }

      // Exchange code for tokens
      const body = new URLSearchParams({
        client_id: this.clientId,
        grant_type: 'authorization_code',
        code,
        redirect_uri: this.redirectUri,
        code_verifier: this.codeVerifier,
      })

      try {
        const res = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body,
        })

        if (!res.ok) throw new Error('Failed to exchange code for tokens')

        const data = await res.json()
        this.accessToken = data.access_token
        this.refreshToken = data.refresh_token

        // Clean URL removing code param
        window.history.replaceState({}, document.title, window.location.pathname)

        this.getProfile()
      } catch (error) {
        alert(error.message)
      }
    },

    async getProfile() {
      if (!this.accessToken) return

      try {
        const res = await fetch('https://api.spotify.com/v1/me', {
          headers: { Authorization: `Bearer ${this.accessToken}` },
        })
        if (!res.ok) throw new Error('Failed to fetch profile')

        this.profile = await res.json()
      } catch (error) {
        alert(error.message)
      }
    },

    logout() {
      this.accessToken = null
      this.refreshToken = null
      this.profile = null
      localStorage.removeItem('code_verifier')
    },
  },
}
</script>

<style>
#app {
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, #1a0033, #000);
  color: #eee;
  min-height: 100vh;
  font-family: Arial, sans-serif;
}

button {
  background: #1db954;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  color: white;
  border-radius: 50px;
  cursor: pointer;
  margin-top: 1rem;
}

button:hover {
  background: #17a44d;
}

img {
  border-radius: 50%;
  margin-top: 1rem;
}
</style>

<template>
  <div>
    <p>Logging you in… please wait.</p>
  </div>
</template>

<script>
export default {
  async mounted() {
    try {
      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.get('code')
      const storedCodeVerifier = localStorage.getItem('code_verifier')

      if (!code || !storedCodeVerifier) {
        alert('Missing code or code verifier. Please try logging in again.')
        return
      }

      // Exchange the code for tokens
      const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: 'YOUR_CLIENT_ID', // Replace with your Spotify client ID
          grant_type: 'authorization_code',
          code,
          redirect_uri: 'https://dessertmood.netlify.app/callback', // Must match your Spotify app redirect URI
          code_verifier: storedCodeVerifier,
        }),
      })

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json()
        throw new Error(`Token exchange failed: ${errorData.error_description || errorData.error}`)
      }

      const tokenData = await tokenResponse.json()
      console.log('Token data:', tokenData)

      // Save tokens as needed, e.g. localStorage or Vuex store
      localStorage.setItem('access_token', tokenData.access_token)
      localStorage.setItem('refresh_token', tokenData.refresh_token)
      localStorage.removeItem('code_verifier') // Clean up

      // Redirect back to home or wherever you want
      this.$router.push('/')
    } catch (error) {
      alert(error.message)
    }
  },
}
</script>

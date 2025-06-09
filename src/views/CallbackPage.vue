<template>
  <div>
    <p>Logging you in… please wait.</p>
  </div>
</template>

<script>
export default {
  async mounted() {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const storedVerifier = localStorage.getItem('code_verifier')

    if (!code || !storedVerifier) {
      alert('Missing authorization code or code verifier. Try logging in again.')
      return
    }

    try {
      const params = new URLSearchParams()
      params.append('client_id', '1602280b57844a7fafc1834758087c42') // Your client ID
      params.append('grant_type', 'authorization_code')
      params.append('code', code)
      params.append('redirect_uri', 'https://dessertmood.netlify.app/callback') // Must match exactly
      params.append('code_verifier', storedVerifier)

      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error_description || err.error)
      }

      const data = await response.json()
      console.log('Tokens:', data)

      // Save your tokens to localStorage or state management
      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('refresh_token', data.refresh_token)
      localStorage.removeItem('code_verifier')

      // Redirect back to main page or dashboard
      this.$router.push('/')
    } catch (error) {
      alert('Token exchange failed: ' + error.message)
    }
  },
}
</script>


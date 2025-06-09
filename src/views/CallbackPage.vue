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
    const storedCodeVerifier = localStorage.getItem('code_verifier')

    if (!code || !storedCodeVerifier) {
      alert('Missing code or code verifier. Please try logging in again.')
      return
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: '1602280b57844a7fafc1834758087c42',
        grant_type: 'authorization_code',
        code,
        redirect_uri: 'https://dessertmood.netlify.app/callback',
        code_verifier: storedCodeVerifier,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      alert(`Error: ${errorData.error_description || errorData.error}`)
      return
    }

    const tokenData = await response.json()
    localStorage.setItem('access_token', tokenData.access_token)
    localStorage.removeItem('code_verifier')

    window.location.href = '/' // Redirect back to home
  },
}
</script>

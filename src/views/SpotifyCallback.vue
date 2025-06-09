<template>
  <div>Logging in...</div>
</template>

<script>
export default {
  async mounted() {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const verifier = localStorage.getItem('code_verifier')

    if (!code || !verifier) {
      alert('Missing code or verifier')
      return
    }

    const data = {
      client_id: '1602280b57844a7fafc1834758087c42',
      grant_type: 'authorization_code',
      code,
      redirect_uri: 'https://dessertmood.netlify.app/',
      code_verifier: verifier,
    }

    const res = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(data),
    })

    const result = await res.json()
    localStorage.setItem('access_token', result.access_token)
    window.location = '/' // go back to main app
  },
}
</script>

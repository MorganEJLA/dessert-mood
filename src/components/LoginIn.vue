<template>
  <div class="login">
    <h1>Log in to match your dessert mood with music</h1>
    <button @click="loginWithSpotify">Login with Spotify</button>
  </div>
</template>

<script setup>
const clientId = '1602280b57844a7fafc1834758087c42' // Replace this
const redirectUri = 'https://dessertmood.netlify.app/callback' // Replace with your deployed Netlify URI
const scopes = ['user-read-private', 'user-read-email']

function loginWithSpotify() {
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes.join(' '))}`
  window.location.href = authUrl
}
</script>

<style scoped>
button {
  background-color: #1db954;
  color: white;
  padding: 12px 24px;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
</style>

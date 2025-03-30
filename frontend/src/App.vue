<template>
  <div id="app">
    <header class="cai-header">
      <div class="cai-logo">
        <div class="logo-placeholder" style="background: var(--cai-gradient); width: 40px; height: 40px; border-radius: 50%;"></div>
        <h1 class="cai-logo-text">COUNTY ASSEMBLY OF ISIOLO</h1>
      </div>
      <nav class="cai-nav">
        <router-link to="/">Home</router-link>
        <router-link to="/streams">Live Streams</router-link>
        <router-link to="/documents">Documents</router-link>
      </nav>
    </header>
    
    <main class="cai-main">
      <router-view />
    </main>
    
    <footer class="cai-footer">
      <p>© 2023 County Assembly of Isiolo. All rights reserved.</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
@import './assets/styles/branding.css';

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.cai-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: var(--cai-gradient);
  color: white;
}

.cai-logo {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.cai-logo-text {
  font-weight: 700;
  font-size: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-on-yellow);
}

.cai-nav {
  display: flex;
  gap: 1.5rem;
}

.cai-nav a {
  color: var(--text-on-yellow);
  text-decoration: none;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.cai-nav a:hover {
  background: rgba(255,255,255,0.2);
}

.cai-nav a.router-link-exact-active {
  background: var(--cai-green);
  color: var(--text-on-green);
}

.cai-main {
  flex: 1;
  padding: 2rem;
  background: #f9f9f9;
}

.cai-footer {
  padding: 1.5rem;
  text-align: center;
  background: var(--cai-gradient-reverse);
  color: var(--text-on-green);
  font-size: 0.9rem;
}
</style>
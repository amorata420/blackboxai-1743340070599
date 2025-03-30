<template>
  <div class="home-view">
    <section class="hero" :style="heroStyle">
      <h1>Welcome to County Assembly of Isiolo</h1>
      <p>Official portal for live proceedings, documents, and public engagement</p>
      <div class="cta-buttons">
        <router-link to="/streams" class="cai-button">Watch Live</router-link>
        <router-link to="/documents" class="cai-button secondary">View Documents</router-link>
      </div>
    </section>

    <section class="features">
      <div class="feature-card" v-for="(feature, index) in features" :key="index">
        <div class="icon" :style="iconStyle(index)">
          <i :class="feature.icon"></i>
        </div>
        <h3>{{ feature.title }}</h3>
        <p>{{ feature.description }}</p>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      features: [
        {
          icon: 'fas fa-video',
          title: 'Live Streaming',
          description: 'Watch assembly proceedings in real-time'
        },
        {
          icon: 'fas fa-file-alt',
          title: 'Document Access',
          description: 'Access official assembly documents and records'
        },
        {
          icon: 'fas fa-comments',
          title: 'Public Participation',
          description: 'Engage with your representatives'
        }
      ]
    }
  },
  computed: {
    heroStyle() {
      return {
        background: 'var(--cai-gradient)',
        color: 'var(--text-on-yellow)'
      }
    }
  },
  methods: {
    iconStyle(index) {
      const colors = ['var(--cai-yellow)', 'var(--cai-green)', 'var(--cai-gradient)']
      return {
        background: colors[index % colors.length],
        color: index % 2 === 0 ? 'var(--text-on-yellow)' : 'var(--text-on-green)'
      }
    }
  }
}
</script>

<style scoped>
.home-view {
  max-width: 1200px;
  margin: 0 auto;
}

.hero {
  padding: 4rem 2rem;
  text-align: center;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: 1.5rem;
}

.cai-button.secondary {
  background: var(--cai-green);
  color: var(--text-on-green);
}
</style>
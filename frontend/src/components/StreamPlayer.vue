<template>
  <div class="stream-player">
    <div class="player-container" ref="playerContainer">
      <video 
        ref="videoPlayer" 
        class="video-js vjs-big-play-centered"
        controls
        autoplay
        playsinline
      ></video>
      
      <div v-if="!isLive" class="offline-overlay">
        <div class="offline-content">
          <i class="fas fa-video-slash"></i>
          <h3>Stream is currently offline</h3>
          <p v-if="nextStream">Next session: {{ nextStream.title }} at {{ formatTime(nextStream.startTime) }}</p>
        </div>
      </div>
    </div>

    <div class="stream-info">
      <h2>{{ currentStream.title }}</h2>
      <p class="stream-description">{{ currentStream.description }}</p>
      <div class="stream-meta">
        <span class="viewer-count">
          <i class="fas fa-users"></i> {{ viewerCount }} viewers
        </span>
        <span class="stream-status" :class="{'live': isLive, 'offline': !isLive}">
          <i class="fas fa-circle"></i> {{ isLive ? 'LIVE' : 'OFFLINE' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import io from 'socket.io-client';

export default {
  name: 'StreamPlayer',
  props: {
    stream: {
      type: Object,
      required: true
    },
    nextStream: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      player: null,
      socket: null,
      viewerCount: 0,
      isLive: false,
      currentStream: this.stream
    }
  },
  computed: {
    streamUrl() {
      return `http://localhost:8000/live/${this.stream.streamKey}/index.m3u8`;
    }
  },
  methods: {
    initPlayer() {
      this.player = videojs(this.$refs.videoPlayer, {
        fluid: true,
        liveui: true,
        sources: [{
          src: this.streamUrl,
          type: 'application/x-mpegURL'
        }],
        html5: {
          hls: {
            overrideNative: true
          }
        }
      });

      this.player.on('error', () => {
        this.isLive = false;
      });
    },
    connectSocket() {
      this.socket = io('http://localhost:5000', {
        query: {
          streamId: this.stream._id
        }
      });

      this.socket.on('viewerCount', (count) => {
        this.viewerCount = count;
      });

      this.socket.on('streamStatus', (status) => {
        this.isLive = status.isLive;
        if (status.isLive) {
          this.player.src({ src: this.streamUrl, type: 'application/x-mpegURL' });
          this.player.play();
        }
      });
    },
    formatTime(dateString) {
      const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return new Date(dateString).toLocaleDateString('en-US', options);
    },
    checkStreamStatus() {
      fetch(`/api/streams/${this.stream._id}`)
        .then(res => res.json())
        .then(data => {
          this.isLive = data.data.isLive;
          this.currentStream = data.data;
        });
    }
  },
  mounted() {
    this.initPlayer();
    this.connectSocket();
    this.checkStreamStatus();
    setInterval(this.checkStreamStatus, 30000);
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose();
    }
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
</script>

<style scoped>
.stream-player {
  background: #1a1a1a;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.player-container {
  position: relative;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
}

.video-js {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.offline-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  z-index: 1;
}

.offline-content {
  text-align: center;
  padding: 2rem;
}

.offline-content i {
  font-size: 3rem;
  color: var(--cai-yellow);
  margin-bottom: 1rem;
}

.stream-info {
  padding: 1.5rem;
  color: white;
}

.stream-description {
  color: #ccc;
  margin: 0.5rem 0 1rem;
}

.stream-meta {
  display: flex;
  gap: 1.5rem;
  font-size: 0.9rem;
}

.viewer-count {
  color: #aaa;
}

.stream-status {
  font-weight: bold;
}

.stream-status.live {
  color: #ff4d4d;
}

.stream-status.offline {
  color: #aaa;
}
</style>
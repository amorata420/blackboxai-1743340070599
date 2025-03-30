<template>
  <div class="streams-view">
    <div class="stream-header" :style="headerStyle">
      <h1>Live & Archived Streams</h1>
      <p>Watch current proceedings or access past recordings</p>
    </div>

    <div class="stream-container">
      <!-- Main Stream Player -->
      <div class="main-stream">
        <div class="stream-placeholder" :style="placeholderStyle">
          <i class="fas fa-video"></i>
          <p>Live stream will appear here</p>
        </div>
        <div class="stream-controls">
          <button class="control-btn" :style="controlBtnStyle">
            <i class="fas fa-play"></i> Play
          </button>
          <button class="control-btn" :style="controlBtnStyle">
            <i class="fas fa-volume-up"></i> Volume
          </button>
          <button class="control-btn" :style="controlBtnStyle">
            <i class="fas fa-expand"></i> Fullscreen
          </button>
        </div>
      </div>

      <!-- Stream Chat -->
      <div class="stream-chat">
        <div class="chat-header" :style="chatHeaderStyle">
          <h3>Live Chat</h3>
        </div>
        <div class="chat-messages">
          <div class="message" v-for="(msg, index) in sampleMessages" :key="index">
            <span class="user" :style="{ color: index % 2 === 0 ? 'var(--cai-yellow)' : 'var(--cai-green)' }">
              {{ msg.user }}:
            </span>
            <span class="text">{{ msg.text }}</span>
          </div>
        </div>
        <div class="chat-input">
          <input type="text" placeholder="Type your message..." :style="inputStyle">
          <button :style="sendBtnStyle">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Upcoming Streams -->
    <div class="upcoming-streams">
      <h2>Upcoming Sessions</h2>
      <div class="stream-cards">
        <div class="stream-card" v-for="(stream, index) in upcomingStreams" :key="index">
          <div class="card-header" :style="cardHeaderStyle(index)">
            <h3>{{ stream.title }}</h3>
            <p>{{ stream.date }}</p>
          </div>
          <div class="card-body">
            <p>{{ stream.description }}</p>
            <button class="remind-btn" :style="remindBtnStyle">
              <i class="fas fa-bell"></i> Set Reminder
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sampleMessages: [
        { user: 'Citizen_1', text: 'This is important for our county' },
        { user: 'Rep_Member', text: 'We appreciate your participation' },
        { user: 'Guest_User', text: 'When will the budget be discussed?' }
      ],
      upcomingStreams: [
        {
          title: 'Budget Approval Session',
          date: 'June 15, 2023 - 10:00 AM',
          description: 'Discussion and approval of county budget allocations'
        },
        {
          title: 'Public Participation Forum',
          date: 'June 20, 2023 - 2:00 PM',
          description: 'Open forum for public input on development projects'
        }
      ]
    }
  },
  computed: {
    headerStyle() {
      return {
        background: 'var(--cai-gradient-reverse)',
        color: 'var(--text-on-green)'
      }
    },
    placeholderStyle() {
      return {
        background: 'linear-gradient(135deg, #f5f5f5 0%, #e5e5e5 100%)',
        border: '2px dashed var(--cai-green)'
      }
    },
    controlBtnStyle() {
      return {
        background: 'var(--cai-yellow)',
        color: 'var(--text-on-yellow)'
      }
    },
    chatHeaderStyle() {
      return {
        background: 'var(--cai-green)',
        color: 'var(--text-on-green)'
      }
    },
    inputStyle() {
      return {
        border: '2px solid var(--cai-yellow)'
      }
    },
    sendBtnStyle() {
      return {
        background: 'var(--cai-yellow)',
        color: 'var(--text-on-yellow)'
      }
    },
    remindBtnStyle() {
      return {
        background: 'var(--cai-gradient)',
        color: 'var(--text-on-yellow)'
      }
    }
  },
  methods: {
    cardHeaderStyle(index) {
      return {
        background: index % 2 === 0 ? 'var(--cai-yellow)' : 'var(--cai-green)',
        color: index % 2 === 0 ? 'var(--text-on-yellow)' : 'var(--text-on-green)'
      }
    }
  }
}
</script>

<style scoped>
.streams-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.stream-header {
  padding: 2rem;
  text-align: center;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.stream-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

.main-stream {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.stream-placeholder {
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #666;
}

.stream-placeholder i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--cai-green);
}

.stream-controls {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f5f5f5;
}

.control-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stream-chat {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  height: 500px;
}

.chat-header {
  padding: 1rem;
  text-align: center;
}

.chat-messages {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
}

.message {
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border-radius: 4px;
  background: #f9f9f9;
}

.user {
  font-weight: bold;
  margin-right: 0.5rem;
}

.chat-input {
  display: flex;
  padding: 1rem;
  border-top: 1px solid #eee;
}

.chat-input input {
  flex: 1;
  padding: 0.5rem;
  border-radius: 4px 0 0 4px;
  border: none;
  outline: none;
}

.chat-input button {
  padding: 0 1rem;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}

.upcoming-streams h2 {
  margin-bottom: 1rem;
  color: var(--cai-green);
}

.stream-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.stream-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.card-header {
  padding: 1rem;
}

.card-body {
  padding: 1rem;
}

.remind-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  margin-top: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
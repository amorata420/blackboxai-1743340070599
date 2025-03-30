<template>
  <div class="stream-chat">
    <div class="chat-header" :style="headerStyle">
      <h3>Live Chat</h3>
      <span class="viewer-count">
        <i class="fas fa-users"></i> {{ viewerCount }} online
      </span>
    </div>
    
    <div class="chat-messages" ref="messagesContainer">
      <div 
        v-for="(message, index) in messages" 
        :key="index" 
        class="message"
        :class="{'own-message': message.userId === currentUser._id}"
      >
        <div class="message-header">
          <span 
            class="username"
            :style="{ color: getUserColor(message.userId) }"
          >
            {{ message.username }}
          </span>
          <span class="timestamp">
            {{ formatTime(message.timestamp) }}
          </span>
        </div>
        <div class="message-content">
          {{ message.content }}
        </div>
      </div>
    </div>
    
    <div class="chat-input">
      <input
        v-model="newMessage"
        type="text"
        placeholder="Type your message..."
        :style="inputStyle"
        @keyup.enter="sendMessage"
      />
      <button 
        @click="sendMessage"
        :style="buttonStyle"
      >
        <i class="fas fa-paper-plane"></i>
      </button>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';

export default {
  name: 'StreamChat',
  props: {
    streamId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      socket: null,
      messages: [],
      newMessage: '',
      viewerCount: 0,
      currentUser: {
        _id: 'user_' + Math.random().toString(36).substr(2, 9),
        name: 'Guest'
      },
      userColors: {}
    }
  },
  computed: {
    headerStyle() {
      return {
        background: 'var(--cai-gradient)',
        color: 'var(--text-on-yellow)'
      }
    },
    inputStyle() {
      return {
        border: '2px solid var(--cai-yellow)'
      }
    },
    buttonStyle() {
      return {
        background: 'var(--cai-green)',
        color: 'var(--text-on-green)'
      }
    }
  },
  methods: {
    connectSocket() {
      this.socket = io('http://localhost:5000', {
        query: {
          streamId: this.streamId,
          userId: this.currentUser._id,
          username: this.currentUser.name
        }
      });

      this.socket.on('chatMessage', (message) => {
        this.messages.push(message);
        this.scrollToBottom();
      });

      this.socket.on('viewerUpdate', (count) => {
        this.viewerCount = count;
      });

      this.socket.on('chatHistory', (history) => {
        this.messages = history;
        this.scrollToBottom();
      });
    },
    sendMessage() {
      if (this.newMessage.trim() === '') return;

      const message = {
        userId: this.currentUser._id,
        username: this.currentUser.name,
        content: this.newMessage,
        timestamp: new Date()
      };

      this.socket.emit('chatMessage', message);
      this.newMessage = '';
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messagesContainer;
        container.scrollTop = container.scrollHeight;
      });
    },
    formatTime(date) {
      return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },
    getUserColor(userId) {
      if (!this.userColors[userId]) {
        // Generate a consistent color based on user ID
        const colors = [
          '#FF5252', '#FFD740', '#69F0AE', '#40C4FF', 
          '#E040FB', '#FF4081', '#536DFE', '#00E676'
        ];
        const hash = userId.split('').reduce((acc, char) => {
          return char.charCodeAt(0) + ((acc << 5) - acc);
        }, 0);
        this.userColors[userId] = colors[Math.abs(hash) % colors.length];
      }
      return this.userColors[userId];
    },
    loadUserData() {
      // In a real app, you would load authenticated user data here
      const savedName = localStorage.getItem('chatUsername');
      if (savedName) {
        this.currentUser.name = savedName;
      } else {
        this.currentUser.name = `Guest${Math.floor(Math.random() * 1000)}`;
        localStorage.setItem('chatUsername', this.currentUser.name);
      }
    }
  },
  mounted() {
    this.loadUserData();
    this.connectSocket();
  },
  beforeDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
</script>

<style scoped>
.stream-chat {
  display: flex;
  flex-direction: column;
  height: 500px;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.chat-header {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.viewer-count {
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.chat-messages {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  background: #f9f9f9;
}

.message {
  margin-bottom: 1rem;
  padding: 0.8rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.message.own-message {
  background: #e3f2fd;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.3rem;
  font-size: 0.8rem;
}

.username {
  font-weight: bold;
}

.timestamp {
  color: #666;
}

.message-content {
  word-break: break-word;
}

.chat-input {
  display: flex;
  padding: 1rem;
  border-top: 1px solid #eee;
  background: white;
}

.chat-input input {
  flex: 1;
  padding: 0.8rem 1rem;
  border: none;
  border-radius: 4px 0 0 4px;
  outline: none;
}

.chat-input button {
  padding: 0 1.2rem;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
}
</style>
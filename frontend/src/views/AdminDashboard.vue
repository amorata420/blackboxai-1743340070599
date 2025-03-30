<template>
  <div class="admin-dashboard">
    <div class="dashboard-header">
      <h1>Admin Dashboard</h1>
      <div class="admin-nav">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="{ active: activeTab === tab.id }"
          :style="tabButtonStyle(tab.id)"
        >
          <i :class="tab.icon"></i> {{ tab.label }}
        </button>
      </div>
    </div>

    <div class="dashboard-content">
      <!-- Streams Management -->
      <div v-if="activeTab === 'streams'" class="tab-content">
        <div class="section-header">
          <h2>Manage Live Streams</h2>
          <button 
            @click="showStreamModal = true"
            class="add-btn"
            :style="addButtonStyle"
          >
            <i class="fas fa-plus"></i> Add New Stream
          </button>
        </div>

        <div class="streams-grid">
          <div 
            v-for="stream in streams" 
            :key="stream._id" 
            class="stream-card"
            :style="cardStyle"
          >
            <div class="stream-thumbnail">
              <img v-if="stream.thumbnail" :src="stream.thumbnail" alt="Stream thumbnail">
              <div v-else class="thumbnail-placeholder">
                <i class="fas fa-video"></i>
              </div>
              <div class="stream-status" :class="{ live: stream.isLive }">
                {{ stream.isLive ? 'LIVE' : 'OFFLINE' }}
              </div>
            </div>

            <div class="stream-info">
              <h3>{{ stream.title }}</h3>
              <p class="stream-description">{{ stream.description }}</p>
              <div class="stream-meta">
                <span class="stream-category">{{ formatCategory(stream.category) }}</span>
                <span class="stream-date">
                  <i class="fas fa-calendar-alt"></i> {{ formatDate(stream.startTime) }}
                </span>
              </div>
            </div>

            <div class="stream-actions">
              <button 
                v-if="!stream.isLive"
                @click="startStream(stream._id)"
                class="action-btn"
                :style="actionBtnStyle"
              >
                <i class="fas fa-play"></i> Start
              </button>
              <button 
                v-else
                @click="endStream(stream._id)"
                class="action-btn danger"
                :style="dangerBtnStyle"
              >
                <i class="fas fa-stop"></i> End
              </button>
              <button 
                @click="editStream(stream)"
                class="action-btn"
                :style="actionBtnStyle"
              >
                <i class="fas fa-edit"></i> Edit
              </button>
              <button 
                @click="deleteStream(stream._id)"
                class="action-btn danger"
                :style="dangerBtnStyle"
              >
                <i class="fas fa-trash"></i> Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Documents Management -->
      <div v-if="activeTab === 'documents'" class="tab-content">
        <div class="section-header">
          <h2>Manage Documents</h2>
          <DocumentUpload @upload-success="fetchDocuments" />
        </div>

        <DocumentList 
          :documents="documents" 
          @edit-document="editDocument"
          @delete-document="deleteDocument"
        />
      </div>

      <!-- Users Management -->
      <div v-if="activeTab === 'users'" class="tab-content">
        <div class="section-header">
          <h2>Manage Users</h2>
          <button 
            @click="showUserModal = true"
            class="add-btn"
            :style="addButtonStyle"
          >
            <i class="fas fa-plus"></i> Add New User
          </button>
        </div>

        <div class="users-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user._id">
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>
                  <span class="role-badge" :style="roleStyle(user.role)">
                    {{ user.role }}
                  </span>
                </td>
                <td>
                  <span class="status-badge" :style="statusStyle(user.status)">
                    {{ user.status }}
                  </span>
                </td>
                <td class="actions">
                  <button 
                    @click="editUser(user)"
                    class="action-btn"
                    :style="actionBtnStyle"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button 
                    @click="deleteUser(user._id)"
                    class="action-btn danger"
                    :style="dangerBtnStyle"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Analytics -->
      <div v-if="activeTab === 'analytics'" class="tab-content">
        <h2>Platform Analytics</h2>
        <div class="analytics-grid">
          <div class="stat-card" :style="statCardStyle">
            <div class="stat-icon">
              <i class="fas fa-users"></i>
            </div>
            <div class="stat-info">
              <h3>{{ analytics.totalUsers }}</h3>
              <p>Total Users</p>
            </div>
          </div>

          <div class="stat-card" :style="statCardStyle">
            <div class="stat-icon">
              <i class="fas fa-video"></i>
            </div>
            <div class="stat-info">
              <h3>{{ analytics.totalStreams }}</h3>
              <p>Total Streams</p>
            </div>
          </div>

          <div class="stat-card" :style="statCardStyle">
            <div class="stat-icon">
              <i class="fas fa-file-alt"></i>
            </div>
            <div class="stat-info">
              <h3>{{ analytics.totalDocuments }}</h3>
              <p>Total Documents</p>
            </div>
          </div>

          <div class="stat-card" :style="statCardStyle">
            <div class="stat-icon">
              <i class="fas fa-eye"></i>
            </div>
            <div class="stat-info">
              <h3>{{ analytics.totalViews }}</h3>
              <p>Total Views</p>
            </div>
          </div>
        </div>

        <div class="charts-container">
          <div class="chart-card">
            <h3>Stream Views</h3>
            <div class="chart-placeholder">
              <i class="fas fa-chart-line"></i>
              <p>Stream views chart will be displayed here</p>
            </div>
          </div>

          <div class="chart-card">
            <h3>Document Downloads</h3>
            <div class="chart-placeholder">
              <i class="fas fa-chart-bar"></i>
              <p>Document downloads chart will be displayed here</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stream Modal -->
    <div v-if="showStreamModal" class="modal-overlay">
      <div class="modal-content">
        <button class="close-btn" @click="showStreamModal = false">
          <i class="fas fa-times"></i>
        </button>
        <h2>{{ editingStream ? 'Edit Stream' : 'Add New Stream' }}</h2>
        <form @submit.prevent="submitStreamForm">
          <div class="form-group">
            <label>Title</label>
            <input 
              type="text" 
              v-model="streamForm.title" 
              required
              :style="inputStyle"
            >
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea 
              v-model="streamForm.description" 
              required
              :style="inputStyle"
            ></textarea>
          </div>

          <div class="form-group">
            <label>Category</label>
            <select v-model="streamForm.category" required :style="selectStyle">
              <option value="assembly-session">Assembly Session</option>
              <option value="committee-meeting">Committee Meeting</option>
              <option value="public-hearing">Public Hearing</option>
              <option value="special-event">Special Event</option>
            </select>
          </div>

          <div class="form-group">
            <label>Thumbnail</label>
            <input 
              type="file" 
              @change="handleThumbnailUpload"
              accept="image/*"
            >
          </div>

          <div class="form-actions">
            <button 
              type="button" 
              @click="showStreamModal = false"
              class="cancel-btn"
              :style="cancelBtnStyle"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="submit-btn"
              :style="submitBtnStyle"
            >
              {{ editingStream ? 'Update' : 'Create' }} Stream
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- User Modal -->
    <div v-if="showUserModal" class="modal-overlay">
      <div class="modal-content">
        <button class="close-btn" @click="showUserModal = false">
          <i class="fas fa-times"></i>
        </button>
        <h2>{{ editingUser ? 'Edit User' : 'Add New User' }}</h2>
        <form @submit.prevent="submitUserForm">
          <div class="form-group">
            <label>Name</label>
            <input 
              type="text" 
              v-model="userForm.name" 
              required
              :style="inputStyle"
            >
          </div>

          <div class="form-group">
            <label>Email</label>
            <input 
              type="email" 
              v-model="userForm.email" 
              required
              :style="inputStyle"
            >
          </div>

          <div class="form-group">
            <label>Role</label>
            <select v-model="userForm.role" required :style="selectStyle">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div class="form-group" v-if="!editingUser">
            <label>Password</label>
            <input 
              type="password" 
              v-model="userForm.password" 
              required
              :style="inputStyle"
            >
          </div>

          <div class="form-actions">
            <button 
              type="button" 
              @click="showUserModal = false"
              class="cancel-btn"
              :style="cancelBtnStyle"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="submit-btn"
              :style="submitBtnStyle"
            >
              {{ editingUser ? 'Update' : 'Create' }} User
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import DocumentUpload from '@/components/DocumentUpload.vue';
import DocumentList from '@/components/DocumentList.vue';

export default {
  name: 'AdminDashboard',
  components: {
    DocumentUpload,
    DocumentList
  },
  data() {
    return {
      activeTab: 'streams',
      tabs: [
        { id: 'streams', label: 'Streams', icon: 'fas fa-video' },
        { id: 'documents', label: 'Documents', icon: 'fas fa-file-alt' },
        { id: 'users', label: 'Users', icon: 'fas fa-users' },
        { id: 'analytics', label: 'Analytics', icon: 'fas fa-chart-pie' }
      ],
      streams: [],
      documents: [],
      users: [],
      analytics: {
        totalUsers: 0,
        totalStreams: 0,
        totalDocuments: 0,
        totalViews: 0
      },
      showStreamModal: false,
      showUserModal: false,
      editingStream: null,
      editingUser: null,
      streamForm: {
        title: '',
        description: '',
        category: 'assembly-session',
        thumbnail: null
      },
      userForm: {
        name: '',
        email: '',
        role: 'user',
        password: ''
      }
    }
  },
  computed: {
    inputStyle() {
      return {
        border: '1px solid var(--cai-yellow)'
      }
    },
    selectStyle() {
      return {
        border: '1px solid var(--cai-green)'
      }
    },
    tabButtonStyle() {
      return (tabId) => ({
        background: this.activeTab === tabId ? 'var(--cai-gradient)' : 'white',
        color: this.activeTab === tabId ? 'var(--text-on-yellow)' : '#666'
      });
    },
    addButtonStyle() {
      return {
        background: 'var(--cai-gradient)',
        color: 'var(--text-on-yellow)'
      }
    },
    actionBtnStyle() {
      return {
        background: 'var(--cai-green)',
        color: 'var(--text-on-green)'
      }
    },
    dangerBtnStyle() {
      return {
        background: '#ff5252',
        color: 'white'
      }
    },
    statCardStyle() {
      return {
        borderTop: '4px solid var(--cai-yellow)'
      }
    },
    cardStyle() {
      return {
        borderLeft: '4px solid var(--cai-green)'
      }
    },
    cancelBtnStyle() {
      return {
        background: '#eee',
        color: '#666'
      }
    },
    submitBtnStyle() {
      return {
        background: 'var(--cai-gradient)',
        color: 'var(--text-on-yellow)'
      }
    },
    roleStyle() {
      return (role) => ({
        background: role === 'admin' ? 'var(--cai-yellow)' : 'var(--cai-green)',
        color: role === 'admin' ? 'var(--text-on-yellow)' : 'var(--text-on-green)'
      });
    },
    statusStyle() {
      return (status) => ({
        background: status === 'active' ? '#69F0AE' : '#FF5252',
        color: 'white'
      });
    }
  },
  methods: {
    async fetchStreams() {
      try {
        const response = await fetch('/api/streams');
        const data = await response.json();
        this.streams = data.data;
      } catch (err) {
        console.error('Error fetching streams:', err);
      }
    },
    async fetchDocuments() {
      try {
        const response = await fetch('/api/documents');
        const data = await response.json();
        this.documents = data.data;
      } catch (err) {
        console.error('Error fetching documents:', err);
      }
    },
    async fetchUsers() {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();
        this.users = data.data;
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    },
    async fetchAnalytics() {
      try {
        const response = await fetch('/api/analytics');
        const data = await response.json();
        this.analytics = data.data;
      } catch (err) {
        console.error('Error fetching analytics:', err);
      }
    },
    async startStream(streamId) {
      try {
        await fetch(`/api/streams/${streamId}/start`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        this.fetchStreams();
      } catch (err) {
        console.error('Error starting stream:', err);
      }
    },
    async endStream(streamId) {
      try {
        await fetch(`/api/streams/${streamId}/end`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        this.fetchStreams();
      } catch (err) {
        console.error('Error ending stream:', err);
      }
    },
    editStream(stream) {
      this.editingStream = stream;
      this.streamForm = {
        title: stream.title,
        description: stream.description,
        category: stream.category,
        thumbnail: null
      };
      this.showStreamModal = true;
    },
    async submitStreamForm() {
      try {
        const url = this.editingStream 
          ? `/api/streams/${this.editingStream._id}`
          : '/api/streams';
        const method = this.editingStream ? 'PUT' : 'POST';

        const formData = new FormData();
        formData.append('title', this.streamForm.title);
        formData.append('description', this.streamForm.description);
        formData.append('category', this.streamForm.category);
        if (this.streamForm.thumbnail) {
          formData.append('thumbnail', this.streamForm.thumbnail);
        }

        const response = await fetch(url, {
          method,
          body: formData,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to save stream');
        }

        this.showStreamModal = false;
        this.fetchStreams();
      } catch (err) {
        console.error('Error saving stream:', err);
      }
    },
    async deleteStream(streamId) {
      if (!confirm('Are you sure you want to delete this stream?')) return;

      try {
        await fetch(`/api/streams/${streamId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        this.fetchStreams();
      } catch (err) {
        console.error('Error deleting stream:', err);
      }
    },
    handleThumbnailUpload(e) {
      this.streamForm.thumbnail = e.target.files[0];
    },
    editUser(user) {
      this.editingUser = user;
      this.userForm = {
        name: user.name,
        email: user.email,
        role: user.role,
        password: ''
      };
      this.showUserModal = true;
    },
    async submitUserForm() {
      try {
        const url = this.editingUser 
          ? `/api/users/${this.editingUser._id}`
          : '/api/users';
        const method = this.editingUser ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(this.userForm)
        });

        if (!response.ok) {
          throw new Error('Failed to save user');
        }

        this.showUserModal = false;
        this.fetchUsers();
      } catch (err) {
        console.error('Error saving user:', err);
      }
    },
    async deleteUser(userId) {
      if (!confirm('Are you sure you want to delete this user?')) return;

      try {
        await fetch(`/api/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        this.fetchUsers();
      } catch (err) {
        console.error('Error deleting user:', err);
      }
    },
    formatCategory(category) {
      const categories = {
        'assembly-session': 'Assembly Session',
        'committee-meeting': 'Committee Meeting',
        'public-hearing': 'Public Hearing',
        'special-event': 'Special Event'
      };
      return categories[category] || category;
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    }
  },
  created() {
    this.fetchStreams();
    this.fetchDocuments();
    this.fetchUsers();
    this.fetchAnalytics();
  }
}
</script>

<style scoped>
.admin-dashboard {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  color: var(--cai-green);
  margin-bottom: 1.5rem;
}

.admin-nav {
  display: flex;
  gap: 0.5rem;
  border-bottom: 1px solid #eee;
}

.admin-nav button {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 4px 4px 0 0;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.add-btn {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.streams-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.stream-card {
  background: white;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
}

.stream-thumbnail {
  position: relative;
  height: 180px;
  background: #f5f5f5;
}

.stream-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ccc;
  font-size: 3rem;
}

.stream-status {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  color: white;
}

.stream-status.live {
  background: #ff5252;
}

.stream-status:not(.live) {
  background: #666;
}

.stream-info {
  padding: 1.5rem;
  flex: 1;
}

.stream-info h3 {
  margin: 0 0 0.5rem;
}

.stream-description {
  color: #555;
  margin: 0.5rem 0;
  font-size: 0.9rem;
}

.stream-meta {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  font-size: 0.8rem;
}

.stream-category {
  color: var(--cai-green);
  font-weight: bold;
}

.stream-date {
  color: #666;
}

.stream-actions {
  padding: 1rem;
  border-top: 1px solid #eee;
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.action-btn.danger {
  background: #ff5252;
  color: white;
}

.users-table {
  background: white;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.users-table table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th, 
.users-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.users-table th {
  background: #f5f5f5;
  font-weight: bold;
}

.role-badge, 
.status-badge {
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.analytics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 4px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--cai-yellow);
  color: var(--text-on-yellow);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-info h3 {
  margin: 0;
  font-size: 1.8rem;
  color: var(--cai-green);
}

.stat-info p {
  margin: 0.3rem 0 0;
  color: #666;
}

.charts-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.chart-card {
  background: white;
  border-radius: 4px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.chart-card h3 {
  margin-top: 0;
  color: var(--cai-green);
}

.chart-placeholder {
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #ccc;
  border: 1px dashed #eee;
  border-radius: 4px;
  margin-top: 1rem;
}

.chart-placeholder i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 2rem;
  position: relative;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.8rem;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.form-group textarea {
  min-height: 100px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.cancel-btn,
.submit-btn {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}

@media (max-width: 768px) {
  .admin-nav {
    flex-wrap: wrap;
  }
  
  .streams-grid {
    grid-template-columns: 1fr;
  }
  
  .charts-container {
    grid-template-columns: 1fr;
  }
}
</style>
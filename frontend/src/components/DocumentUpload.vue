<template>
  <div class="document-upload">
    <div class="upload-container" :style="containerStyle">
      <div v-if="!isUploading" class="upload-area" @dragover.prevent @drop="handleDrop">
        <input 
          type="file" 
          ref="fileInput" 
          @change="handleFileSelect"
          accept=".pdf,.docx,.xlsx,.pptx,.txt"
          style="display: none"
        >
        <i class="fas fa-cloud-upload-alt"></i>
        <p>Drag & drop files here or <span @click="triggerFileInput">browse</span></p>
        <p class="file-types">Supported formats: PDF, DOCX, XLSX, PPTX, TXT</p>
      </div>
      
      <div v-else class="upload-progress">
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ width: uploadProgress + '%', background: progressColor }"
          ></div>
        </div>
        <p>Uploading: {{ currentFile.name }} ({{ formatFileSize(currentFile.size) }})</p>
        <p>{{ uploadProgress }}% complete</p>
      </div>

      <div v-if="selectedFile" class="file-preview">
        <div class="file-icon">
          <i :class="getFileIcon(selectedFile.name)"></i>
        </div>
        <div class="file-info">
          <p class="file-name">{{ selectedFile.name }}</p>
          <p class="file-size">{{ formatFileSize(selectedFile.size) }}</p>
        </div>
        <button @click="removeFile" class="remove-btn">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="form-fields">
        <div class="form-group">
          <label>Title</label>
          <input 
            type="text" 
            v-model="documentTitle" 
            placeholder="Enter document title"
            :style="inputStyle"
          >
        </div>
        
        <div class="form-group">
          <label>Description</label>
          <textarea 
            v-model="documentDescription" 
            placeholder="Enter document description"
            :style="inputStyle"
          ></textarea>
        </div>

        <div class="form-group">
          <label>Category</label>
          <select v-model="documentCategory" :style="selectStyle">
            <option value="minutes">Meeting Minutes</option>
            <option value="reports">Reports</option>
            <option value="bills">Bills</option>
            <option value="budgets">Budgets</option>
            <option value="policies">Policies</option>
            <option value="notices">Notices</option>
          </select>
        </div>

        <div class="form-group checkbox-group">
          <input 
            type="checkbox" 
            id="isPublic" 
            v-model="isPublic"
            :style="checkboxStyle"
          >
          <label for="isPublic">Make this document public</label>
        </div>

        <button 
          @click="uploadDocument" 
          :disabled="!canUpload"
          class="upload-btn"
          :style="uploadBtnStyle"
        >
          Upload Document
        </button>
      </div>
    </div>

    <div v-if="errorMessage" class="error-message">
      <i class="fas fa-exclamation-circle"></i> {{ errorMessage }}
    </div>

    <div v-if="successMessage" class="success-message">
      <i class="fas fa-check-circle"></i> {{ successMessage }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'DocumentUpload',
  data() {
    return {
      selectedFile: null,
      documentTitle: '',
      documentDescription: '',
      documentCategory: 'minutes',
      isPublic: true,
      isUploading: false,
      uploadProgress: 0,
      currentFile: null,
      errorMessage: '',
      successMessage: ''
    }
  },
  computed: {
    canUpload() {
      return this.selectedFile && this.documentTitle.trim() !== '';
    },
    containerStyle() {
      return {
        border: `2px dashed ${this.isUploading ? 'var(--cai-green)' : 'var(--cai-yellow)'}`
      }
    },
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
    checkboxStyle() {
      return {
        accentColor: 'var(--cai-yellow)'
      }
    },
    uploadBtnStyle() {
      return {
        background: this.canUpload ? 'var(--cai-gradient)' : '#ccc',
        color: this.canUpload ? 'var(--text-on-yellow)' : '#666'
      }
    },
    progressColor() {
      const progress = this.uploadProgress;
      if (progress < 30) return '#ff5252';
      if (progress < 70) return '#ffd740';
      return '#69f0ae';
    }
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileSelect(e) {
      const file = e.target.files[0];
      this.validateAndSetFile(file);
    },
    handleDrop(e) {
      const file = e.dataTransfer.files[0];
      this.validateAndSetFile(file);
    },
    validateAndSetFile(file) {
      if (!file) return;

      const validTypes = ['application/pdf', 
                         'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                         'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                         'text/plain'];
      
      if (!validTypes.includes(file.type)) {
        this.errorMessage = 'Invalid file type. Please upload a PDF, DOCX, XLSX, PPTX, or TXT file.';
        return;
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        this.errorMessage = 'File size exceeds 10MB limit.';
        return;
      }

      this.errorMessage = '';
      this.selectedFile = file;
    },
    removeFile() {
      this.selectedFile = null;
    },
    getFileIcon(filename) {
      const ext = filename.split('.').pop().toLowerCase();
      switch(ext) {
        case 'pdf': return 'fas fa-file-pdf';
        case 'docx': return 'fas fa-file-word';
        case 'xlsx': return 'fas fa-file-excel';
        case 'pptx': return 'fas fa-file-powerpoint';
        case 'txt': return 'fas fa-file-alt';
        default: return 'fas fa-file';
      }
    },
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    async uploadDocument() {
      if (!this.canUpload) return;

      this.isUploading = true;
      this.currentFile = this.selectedFile;
      this.errorMessage = '';
      this.successMessage = '';

      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('title', this.documentTitle);
      formData.append('description', this.documentDescription);
      formData.append('category', this.documentCategory);
      formData.append('isPublic', this.isPublic);

      try {
        const response = await fetch('/api/documents', {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Upload failed');
        }

        const data = await response.json();
        this.successMessage = 'Document uploaded successfully!';
        this.resetForm();
        this.$emit('upload-success', data.data);
      } catch (err) {
        this.errorMessage = err.message;
      } finally {
        this.isUploading = false;
        this.uploadProgress = 0;
      }
    },
    resetForm() {
      this.selectedFile = null;
      this.documentTitle = '';
      this.documentDescription = '';
      this.documentCategory = 'minutes';
      this.isPublic = true;
    }
  }
}
</script>

<style scoped>
.document-upload {
  max-width: 800px;
  margin: 0 auto;
}

.upload-container {
  padding: 2rem;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.upload-area {
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-area:hover {
  background: rgba(255, 215, 0, 0.1);
}

.upload-area i {
  font-size: 3rem;
  color: var(--cai-yellow);
  margin-bottom: 1rem;
}

.upload-area span {
  color: var(--cai-green);
  text-decoration: underline;
  cursor: pointer;
}

.file-types {
  color: #666;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.upload-progress {
  text-align: center;
  padding: 1rem 0;
}

.progress-bar {
  height: 10px;
  background: #eee;
  border-radius: 5px;
  margin-bottom: 1rem;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.file-preview {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 4px;
  margin: 1rem 0;
}

.file-icon {
  font-size: 1.5rem;
  color: var(--cai-green);
  margin-right: 1rem;
}

.file-info {
  flex: 1;
}

.file-name {
  font-weight: bold;
  margin-bottom: 0.3rem;
}

.file-size {
  color: #666;
  font-size: 0.9rem;
}

.remove-btn {
  background: none;
  border: none;
  color: #ff5252;
  cursor: pointer;
  font-size: 1.2rem;
}

.form-fields {
  margin-top: 2rem;
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
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

.checkbox-group {
  display: flex;
  align-items: center;
}

.checkbox-group input {
  width: auto;
  margin-right: 0.5rem;
}

.upload-btn {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-btn:disabled {
  cursor: not-allowed;
}

.error-message,
.success-message {
  padding: 1rem;
  margin-top: 1rem;
  border-radius: 4px;
  text-align: center;
}

.error-message {
  background: #ffebee;
  color: #ff5252;
}

.success-message {
  background: #e8f5e9;
  color: #4caf50;
}
</style>
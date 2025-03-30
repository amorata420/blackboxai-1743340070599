<template>
  <div class="document-list">
    <div class="list-header">
      <h2>County Assembly Documents</h2>
      <div class="list-controls">
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search documents..."
            :style="inputStyle"
          >
          <button :style="searchBtnStyle">
            <i class="fas fa-search"></i>
          </button>
        </div>
        <select v-model="selectedCategory" :style="selectStyle">
          <option value="">All Categories</option>
          <option 
            v-for="category in categories" 
            :key="category.value"
            :value="category.value"
          >
            {{ category.label }}
          </option>
        </select>
      </div>
    </div>

    <div class="document-grid">
      <div 
        v-for="document in filteredDocuments" 
        :key="document._id" 
        class="document-card"
        :style="cardStyle"
      >
        <div class="card-header">
          <div class="document-icon" :style="iconStyle(document.fileType)">
            <i :class="getFileIcon(document.fileType)"></i>
          </div>
          <h3>{{ document.title }}</h3>
        </div>
        
        <div class="card-body">
          <p class="document-description">{{ document.description }}</p>
          <div class="document-meta">
            <span class="category-badge" :style="categoryStyle(document.category)">
              {{ formatCategory(document.category) }}
            </span>
            <span class="file-size">{{ document.fileSize }}</span>
          </div>
        </div>

        <div class="card-footer">
          <span class="upload-date">
            <i class="fas fa-calendar-alt"></i> {{ formatDate(document.createdAt) }}
          </span>
          <div class="document-actions">
            <button 
              @click="previewDocument(document)"
              class="action-btn"
              :style="actionBtnStyle"
            >
              <i class="fas fa-eye"></i> Preview
            </button>
            <button 
              @click="downloadDocument(document._id)"
              class="action-btn"
              :style="actionBtnStyle"
            >
              <i class="fas fa-download"></i> Download
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="filteredDocuments.length === 0" class="empty-state">
      <i class="fas fa-folder-open"></i>
      <p>No documents found matching your criteria</p>
    </div>

    <div class="pagination-controls" v-if="totalPages > 1">
      <button 
        @click="prevPage" 
        :disabled="currentPage === 1"
        :style="paginationBtnStyle"
      >
        <i class="fas fa-chevron-left"></i> Previous
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button 
        @click="nextPage" 
        :disabled="currentPage === totalPages"
        :style="paginationBtnStyle"
      >
        Next <i class="fas fa-chevron-right"></i>
      </button>
    </div>

    <DocumentPreview 
      v-if="previewDocumentData"
      :document="previewDocumentData"
      @close="previewDocumentData = null"
    />
  </div>
</template>

<script>
import DocumentPreview from './DocumentPreview.vue';

export default {
  name: 'DocumentList',
  components: {
    DocumentPreview
  },
  props: {
    documents: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      searchQuery: '',
      selectedCategory: '',
      currentPage: 1,
      itemsPerPage: 9,
      previewDocumentData: null,
      categories: [
        { value: 'minutes', label: 'Meeting Minutes' },
        { value: 'reports', label: 'Reports' },
        { value: 'bills', label: 'Bills' },
        { value: 'budgets', label: 'Budgets' },
        { value: 'policies', label: 'Policies' },
        { value: 'notices', label: 'Notices' }
      ]
    }
  },
  computed: {
    filteredDocuments() {
      let filtered = this.documents;

      // Filter by search query
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(doc => 
          doc.title.toLowerCase().includes(query) || 
          doc.description.toLowerCase().includes(query)
        );
      }

      // Filter by category
      if (this.selectedCategory) {
        filtered = filtered.filter(doc => doc.category === this.selectedCategory);
      }

      // Pagination
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      return filtered.slice(startIndex, startIndex + this.itemsPerPage);
    },
    totalPages() {
      return Math.ceil(this.documents.length / this.itemsPerPage);
    },
    inputStyle() {
      return {
        border: '1px solid var(--cai-yellow)'
      }
    },
    searchBtnStyle() {
      return {
        background: 'var(--cai-yellow)',
        color: 'var(--text-on-yellow)'
      }
    },
    selectStyle() {
      return {
        border: '1px solid var(--cai-green)'
      }
    },
    cardStyle() {
      return {
        borderTop: '4px solid var(--cai-yellow)'
      }
    },
    actionBtnStyle() {
      return {
        background: 'var(--cai-green)',
        color: 'var(--text-on-green)'
      }
    },
    paginationBtnStyle() {
      return {
        background: 'var(--cai-yellow)',
        color: 'var(--text-on-yellow)'
      }
    }
  },
  methods: {
    getFileIcon(fileType) {
      switch(fileType) {
        case 'pdf': return 'fas fa-file-pdf';
        case 'docx': return 'fas fa-file-word';
        case 'xlsx': return 'fas fa-file-excel';
        case 'pptx': return 'fas fa-file-powerpoint';
        case 'txt': return 'fas fa-file-alt';
        default: return 'fas fa-file';
      }
    },
    formatCategory(category) {
      const found = this.categories.find(c => c.value === category);
      return found ? found.label : category;
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    },
    iconStyle(fileType) {
      const colors = {
        pdf: '#FF5252',
        docx: '#2B579A',
        xlsx: '#217346',
        pptx: '#D24726',
        txt: '#666666'
      };
      return {
        background: colors[fileType] || 'var(--cai-green)',
        color: 'white'
      };
    },
    categoryStyle(category) {
      const colors = {
        minutes: '#FFD740',
        reports: '#69F0AE',
        bills: '#40C4FF',
        budgets: '#E040FB',
        policies: '#FF4081',
        notices: '#536DFE'
      };
      return {
        background: colors[category] || '#9E9E9E',
        color: 'white'
      };
    },
    previewDocument(document) {
      this.previewDocumentData = document;
    },
    async downloadDocument(documentId) {
      window.open(`/api/documents/${documentId}/download`, '_blank');
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    }
  }
}
</script>

<style scoped>
.document-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.list-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-box {
  display: flex;
}

.search-box input {
  padding: 0.5rem 1rem;
  border-radius: 4px 0 0 4px;
  border: none;
  outline: none;
  min-width: 250px;
}

.search-box button {
  padding: 0 1rem;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}

select {
  padding: 0.5rem;
  border-radius: 4px;
  outline: none;
}

.document-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.document-card {
  background: white;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
}

.card-header {
  padding: 1.5rem 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.document-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.card-header h3 {
  margin: 0;
  font-size: 1.1rem;
  word-break: break-word;
}

.card-body {
  padding: 1rem 1.5rem;
  flex: 1;
}

.document-description {
  color: #555;
  margin: 0.5rem 0 1rem;
  font-size: 0.9rem;
  word-break: break-word;
}

.document-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.category-badge {
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
}

.file-size {
  color: #666;
  font-size: 0.8rem;
}

.card-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.upload-date {
  color: #666;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.document-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.5rem 0.8rem;
  border: none;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--cai-yellow);
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  margin-top: 2rem;
}

.pagination-controls button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-controls span {
  color: #666;
}
</style>
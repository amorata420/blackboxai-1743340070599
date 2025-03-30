<template>
  <div class="documents-view">
    <div class="documents-header" :style="headerStyle">
      <h1>Official Documents</h1>
      <p>Access County Assembly records, reports, and legislation</p>
    </div>

    <div class="document-actions">
      <div class="search-bar">
        <input 
          type="text" 
          placeholder="Search documents..." 
          :style="inputStyle"
          v-model="searchQuery"
        >
        <button :style="searchBtnStyle">
          <i class="fas fa-search"></i>
        </button>
      </div>
      <div class="filter-controls">
        <select :style="selectStyle" v-model="selectedCategory">
          <option value="">All Categories</option>
          <option 
            v-for="(category, index) in categories" 
            :key="index" 
            :value="category"
            :style="optionStyle(index)"
          >
            {{ category }}
          </option>
        </select>
        <button class="upload-btn" :style="uploadBtnStyle">
          <i class="fas fa-upload"></i> Upload Document
        </button>
      </div>
    </div>

    <div class="documents-grid">
      <div 
        class="document-card" 
        v-for="(doc, index) in filteredDocuments" 
        :key="doc.id"
        :style="cardStyle(index)"
      >
        <div class="doc-icon" :style="iconStyle(doc.type)">
          <i :class="getFileIcon(doc.type)"></i>
        </div>
        <div class="doc-details">
          <h3>{{ doc.title }}</h3>
          <p class="doc-meta">
            <span>{{ doc.category }}</span> • 
            <span>{{ doc.date }}</span> • 
            <span>{{ doc.size }}</span>
          </p>
          <p class="doc-description">{{ doc.description }}</p>
        </div>
        <div class="doc-actions">
          <button class="action-btn" :style="actionBtnStyle">
            <i class="fas fa-eye"></i> Preview
          </button>
          <button class="action-btn" :style="actionBtnStyle">
            <i class="fas fa-download"></i> Download
          </button>
        </div>
      </div>
    </div>

    <div class="pagination-controls">
      <button :style="paginationBtnStyle">
        <i class="fas fa-chevron-left"></i> Previous
      </button>
      <span>Page 1 of 5</span>
      <button :style="paginationBtnStyle">
        Next <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: '',
      selectedCategory: '',
      categories: [
        'Legislation',
        'Minutes',
        'Reports',
        'Budgets',
        'Policies'
      ],
      documents: [
        {
          id: 1,
          title: 'County Budget FY 2023-2024',
          category: 'Budgets',
          type: 'pdf',
          date: 'May 15, 2023',
          size: '2.4 MB',
          description: 'Approved county budget for fiscal year 2023-2024'
        },
        {
          id: 2,
          title: 'Assembly Meeting Minutes - June 2023',
          category: 'Minutes',
          type: 'doc',
          date: 'June 5, 2023',
          size: '1.2 MB',
          description: 'Official minutes from June assembly meeting'
        },
        {
          id: 3,
          title: 'Public Health Policy Draft',
          category: 'Policies',
          type: 'pdf',
          date: 'April 20, 2023',
          size: '3.1 MB',
          description: 'Draft version of new public health policy'
        }
      ]
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
    searchBtnStyle() {
      return {
        background: 'var(--cai-yellow)',
        color: 'var(--text-on-yellow)'
      }
    },
    selectStyle() {
      return {
        border: '2px solid var(--cai-green)'
      }
    },
    uploadBtnStyle() {
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
    paginationBtnStyle() {
      return {
        background: 'var(--cai-yellow)',
        color: 'var(--text-on-yellow)'
      }
    },
    filteredDocuments() {
      return this.documents.filter(doc => {
        const matchesSearch = doc.title.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
                             doc.description.toLowerCase().includes(this.searchQuery.toLowerCase())
        const matchesCategory = !this.selectedCategory || doc.category === this.selectedCategory
        return matchesSearch && matchesCategory
      })
    }
  },
  methods: {
    getFileIcon(type) {
      const icons = {
        pdf: 'fas fa-file-pdf',
        doc: 'fas fa-file-word',
        xls: 'fas fa-file-excel'
      }
      return icons[type] || 'fas fa-file'
    },
    iconStyle(type) {
      const colors = {
        pdf: '#FF5252',
        doc: '#2B579A',
        xls: '#217346'
      }
      return {
        background: colors[type] || 'var(--cai-green)',
        color: 'white'
      }
    },
    cardStyle(index) {
      return {
        borderLeft: `4px solid ${index % 2 === 0 ? 'var(--cai-yellow)' : 'var(--cai-green)'}`
      }
    },
    optionStyle(index) {
      return {
        color: index % 2 === 0 ? 'var(--cai-yellow)' : 'var(--cai-green)'
      }
    }
  }
}
</script>

<style scoped>
.documents-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.documents-header {
  padding: 2rem;
  text-align: center;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.document-actions {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.search-bar {
  display: flex;
  flex: 1;
  min-width: 300px;
}

.search-bar input {
  flex: 1;
  padding: 0.5rem 1rem;
  border-radius: 4px 0 0 4px;
  border: none;
  outline: none;
}

.search-bar button {
  padding: 0 1rem;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}

.filter-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.filter-controls select {
  padding: 0.5rem;
  border-radius: 4px;
  outline: none;
}

.upload-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.documents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.document-card {
  background: white;
  border-radius: 4px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
}

.doc-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.doc-details {
  flex: 1;
}

.doc-meta {
  color: #666;
  font-size: 0.9rem;
  margin: 0.5rem 0;
}

.doc-description {
  color: #444;
  margin: 0.5rem 0 1rem;
}

.doc-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.9rem;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
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

.pagination-controls span {
  color: #666;
}
</style>
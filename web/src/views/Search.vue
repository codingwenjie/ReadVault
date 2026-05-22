<template>
  <div class="page-container">
    <NavBar />
    
    <div class="page-content">
      <div class="search-header">
        <div class="search-box-wrapper">
          <div class="search-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              v-model="searchQuery"
              placeholder="搜索书籍、作者..."
              class="search-input"
              @keyup.enter="handleSearch"
            />
            <button
              v-if="searchQuery"
              class="clear-btn"
              @click="clearSearch"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <button
              v-if="!searchQuery"
              class="voice-btn"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 19c-2.67 0-8-1.34-8-4v-4c0-2.66 5.33-4 8-4s8 1.34 8 4v4c0 2.66-5.33 4-8 4z"></path>
                <polyline points="12 12 12 19"></polyline>
                <line x1="9" y1="9" x2="15" y2="9"></line>
              </svg>
            </button>
          </div>
          <button class="search-btn" @click="handleSearch">
            搜索
          </button>
        </div>

        <div class="category-tags">
          <button
            v-for="tag in categories"
            :key="tag.value"
            class="category-tag"
            :class="{ active: selectedCategory === tag.value }"
            @click="selectedCategory = tag.value"
          >
            {{ tag.label }}
          </button>
        </div>
      </div>

      <div v-if="loading" class="spinner-container">
        <div class="spinner"></div>
      </div>

      <div v-else-if="searchQuery && !loading && searchResults.length === 0" class="empty-state">
        <div class="empty-icon-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <p>未找到相关书籍</p>
        <button class="btn btn-outline" @click="clearSearch">换个关键词试试</button>
      </div>

      <div v-else-if="!searchQuery" class="default-content">
        <div class="default-section">
          <h3 class="default-title">热门搜索</h3>
          <div class="hot-tags">
            <button
              v-for="(hotTag, index) in hotTags"
              :key="hotTag"
              class="hot-tag"
              :style="{ animationDelay: index * 0.1 + 's' }"
              @click="searchQuery = hotTag; handleSearch()"
            >
              {{ hotTag }}
            </button>
          </div>
        </div>
      </div>

      <div v-else class="search-results">
        <div class="results-header">
          <span class="results-count">找到 {{ searchResults.length }} 本相关书籍</span>
        </div>
        <div class="results-list">
          <div
            v-for="book in searchResults"
            :key="book.bookId"
            class="result-item"
            @click="handleBookClick(book)"
          >
            <div class="result-cover-wrapper">
              <img :src="book.cover" :alt="book.title" class="result-cover" />
              <div v-if="book.newRating" class="result-rating">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                {{ book.newRating.toFixed(1) }}
              </div>
            </div>
            <div class="result-info">
              <h3 class="result-title">{{ book.title }}</h3>
              <p class="result-author">{{ book.author }}</p>
              <p class="result-intro">{{ book.intro }}</p>
              <div class="result-meta">
                <span class="result-category">{{ book.category }}</span>
                <span class="result-publisher">{{ book.publisher }}</span>
              </div>
            </div>
            <button class="result-action">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 11 12 14 22 4"></polyline>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { wereadApi } from '@/api/weread'
import NavBar from '@/components/NavBar.vue'
import type { SearchBookInfo } from '@/api/weread'

interface SearchResultItem extends SearchBookInfo {
  newRating?: number
}

const searchQuery = ref('')
const selectedCategory = ref('')
const searchResults = ref<SearchResultItem[]>([])
const loading = ref(false)

const categories = [
  { label: '全部', value: '' },
  { label: '小说', value: '小说' },
  { label: '文学', value: '文学' },
  { label: '经管', value: '经管' },
  { label: '科技', value: '科技' },
  { label: '人文', value: '人文' },
  { label: '社科', value: '社科' },
]

const hotTags = [
  '三体', '活着', '百年孤独', '人类简史', '原则',
  '明朝那些事儿', '白夜行', '小王子', '围城', '红楼梦'
]

const handleSearch = async () => {
  if (!searchQuery.value.trim()) return

  loading.value = true

  try {
    const response = await wereadApi.search(searchQuery.value)
    if (response.code === 0) {
      const books = response.data.results?.[0]?.books || []
      searchResults.value = books.map((item: { bookInfo: SearchBookInfo; newRating?: number }) => ({
        ...item.bookInfo,
        newRating: item.newRating
      }))
    }
  } catch (e) {
    console.error('搜索失败', e)
  } finally {
    loading.value = false
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
}

const handleBookClick = (book: SearchBookInfo) => {
  console.log('点击书籍:', book.title)
}
</script>

<style scoped>
.search-header {
  margin-bottom: var(--spacing-xl);
}

.search-box-wrapper {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  padding: var(--spacing-sm) var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
}

.search-box:focus-within {
  border-color: var(--color-primary-start);
  box-shadow: var(--shadow-glow);
}

.search-icon {
  width: 18px;
  height: 18px;
  color: var(--color-text-muted);
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
}

.search-input::placeholder {
  color: var(--color-text-muted);
}

.clear-btn,
.voice-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--color-text-muted);
  transition: color var(--transition-fast);
}

.clear-btn:hover,
.voice-btn:hover {
  color: var(--color-primary-start);
}

.clear-btn svg,
.voice-btn svg {
  width: 16px;
  height: 16px;
}

.search-btn {
  padding: var(--spacing-sm) var(--spacing-xl);
  background: var(--color-primary-gradient);
  color: white;
  border: none;
  border-radius: var(--radius-xl);
  font-size: var(--font-size-base);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-sm);
}

.search-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.category-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.category-tag {
  padding: var(--spacing-xs) var(--spacing-lg);
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.category-tag:hover {
  border-color: var(--color-primary-start);
  color: var(--color-primary-start);
}

.category-tag.active {
  background: var(--color-primary-gradient);
  border-color: var(--color-primary-start);
  color: white;
}

.default-content {
  margin-top: var(--spacing-xl);
}

.default-section {
  margin-bottom: var(--spacing-2xl);
}

.default-title {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-md) 0;
}

.hot-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.hot-tag {
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  animation: fadeInUp 0.4s ease-out forwards;
  opacity: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hot-tag:hover {
  background: var(--color-primary-glass);
  border-color: var(--color-primary-start);
  color: var(--color-primary-start);
}

.search-results {
  margin-top: var(--spacing-xl);
}

.results-header {
  margin-bottom: var(--spacing-lg);
}

.results-count {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.result-item {
  display: flex;
  gap: var(--spacing-lg);
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border-light);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.result-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.result-cover-wrapper {
  position: relative;
  width: 100px;
  flex-shrink: 0;
}

.result-cover {
  width: 100%;
  height: 133px;
  object-fit: cover;
  border-radius: var(--radius-md);
}

.result-rating {
  position: absolute;
  bottom: -6px;
  left: -6px;
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 3px 8px;
  background: var(--color-accent-gold-gradient);
  color: white;
  font-size: var(--font-size-xs);
  font-weight: 600;
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-sm);
}

.result-rating svg {
  width: 11px;
  height: 11px;
}

.result-info {
  flex: 1;
  min-width: 0;
}

.result-title {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-xs) 0;
}

.result-author {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0 0 var(--spacing-sm) 0;
}

.result-intro {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  line-height: 1.6;
  margin: 0 0 var(--spacing-md) 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.result-meta {
  display: flex;
  gap: var(--spacing-md);
}

.result-category,
.result-publisher {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  background: var(--color-bg-tertiary);
  padding: 2px 8px;
  border-radius: var(--radius-full);
}

.result-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: var(--color-primary-glass);
  border: none;
  border-radius: var(--radius-md);
  color: var(--color-primary-start);
  cursor: pointer;
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.result-action:hover {
  background: var(--color-primary-start);
  color: white;
}

.result-action svg {
  width: 18px;
  height: 18px;
}

.spinner-container {
  display: flex;
  justify-content: center;
  padding: var(--spacing-3xl);
}

.spinner {
  width: 48px;
  height: 48px;
  border: 3px solid rgba(102, 126, 234, 0.1);
  border-top-color: var(--color-primary-start);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-3xl);
}

.empty-icon-wrap {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-xl);
  margin-bottom: var(--spacing-lg);
}

.empty-icon-wrap svg {
  width: 40px;
  height: 40px;
  color: var(--color-text-muted);
}

.empty-state p {
  font-size: var(--font-size-base);
  color: var(--color-text-muted);
  margin: 0 0 var(--spacing-lg) 0;
}

@media (max-width: 768px) {
  .search-box-wrapper {
    flex-direction: column;
  }
  
  .search-btn {
    width: 100%;
  }
  
  .result-item {
    flex-direction: column;
  }
  
  .result-cover-wrapper {
    width: 100%;
  }
  
  .result-cover {
    width: 100%;
    height: auto;
    aspect-ratio: 3/4;
  }
  
  .result-action {
    align-self: flex-start;
  }
}
</style>
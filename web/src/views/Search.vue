<template>
  <div class="page-container">
    <div class="page-content">
      <div class="page-header">
        <h1 class="page-title">搜索书籍</h1>
      </div>

      <!-- Search Input -->
      <div class="search-input-wrap">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="搜索书名、作者或关键词..."
          class="search-input"
          @keyup.enter="handleSearch"
        />
        <button v-if="searchQuery" class="clear-btn" @click="clearSearch">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- Category Chips -->
      <div class="category-chips">
        <button
          v-for="cat in categories"
          :key="cat.value"
          class="chip"
          :class="{ active: selectedCategory === cat.value }"
          @click="selectCategory(cat.value)"
        >
          {{ cat.label }}
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="spinner-wrap">
        <div class="spinner"></div>
      </div>

      <!-- Empty State (no query) -->
      <div v-else-if="!hasSearched" class="default-section">
        <p class="default-label">猜你喜欢</p>
        <span class="default-count">{{ defaultBooks.length }} 本</span>
      </div>

      <!-- Results Header -->
      <div v-if="!loading && hasSearched" class="results-label">
        <span>"{{ lastQuery }}" 的搜索结果</span>
        <span class="results-count">{{ searchResults.length }} 本</span>
      </div>

      <!-- Empty Search Result -->
      <div v-if="!loading && hasSearched && searchResults.length === 0" class="empty-result">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <p>没有找到相关书籍</p>
        <p class="empty-hint">试试其他关键词</p>
      </div>

      <!-- Result List / Default List -->
      <div v-if="!loading" class="result-list">
        <div
          v-for="book in displayList"
          :key="book.bookId || book.id"
          class="result-card"
          @click="handleBookClick(book)"
        >
          <img :src="book.cover" :alt="book.title" class="result-cover" />
          <div class="result-body">
            <div class="result-top">
              <div>
                <h3 class="result-title">{{ book.title }}</h3>
                <p class="result-author">{{ book.author }}</p>
              </div>
              <span class="result-tag">{{ book.category || '书籍' }}</span>
            </div>
            <p class="result-desc">{{ book.intro || book.description || '' }}</p>
            <div class="result-footer">
              <div class="rating-block">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <span class="rating-value">{{ getRating(book) }}</span>
                <span class="rating-max">/ 5.0</span>
              </div>
              <button class="btn-add">加入书架</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { wereadApi } from '@/api/weread'
import type { SearchBookInfo } from '@/api/weread'

interface SearchResultItem extends SearchBookInfo {
  id?: number
  description?: string
  newRating?: number
}

const searchQuery = ref('')
const selectedCategory = ref('全部')
const searchResults = ref<SearchResultItem[]>([])
const loading = ref(false)
const hasSearched = ref(false)
const lastQuery = ref('')
const defaultBooks = ref<SearchResultItem[]>([])

const categories = [
  { label: '全部', value: '全部' },
  { label: '文学', value: '文学' },
  { label: '历史', value: '历史' },
  { label: '科技', value: '科技' },
  { label: '心理', value: '心理' },
  { label: '经济', value: '经济' },
  { label: '哲学', value: '哲学' },
  { label: '传记', value: '传记' },
]

const displayList = computed(() => {
  if (!hasSearched.value) return defaultBooks.value
  return searchResults.value
})

const getRating = (book: SearchResultItem): string => {
  if (book.newRating) return book.newRating.toFixed(1)
  return '--'
}

const selectCategory = (val: string) => {
  selectedCategory.value = val
}

const handleSearch = async () => {
  const q = searchQuery.value.trim()
  if (!q) return

  loading.value = true
  hasSearched.value = true
  lastQuery.value = q

  try {
    const response = await wereadApi.search(q)
    if (response.code === 0) {
      const books = response.data.results?.[0]?.books || []
      searchResults.value = books.map((item: { bookInfo: SearchBookInfo; newRating?: number }) => ({
        ...item.bookInfo,
        newRating: item.newRating,
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
  hasSearched.value = false
  searchResults.value = []
}

const handleBookClick = (book: SearchResultItem) => {
  console.log('点击书籍:', book.title)
}
</script>

<style scoped>
.page-container {
  min-height: 100%;
}

.page-content {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #1e1b4b;
  margin: 0;
}

/* ── Search Input ── */
.search-input-wrap {
  position: relative;
  margin-bottom: 20px;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: #9ca3af;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 12px 44px 12px 44px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
  color: #1e1b4b;
  outline: none;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 150ms;
}

.search-input::placeholder {
  color: #9ca3af;
}

.search-input:focus {
  border-color: rgba(102, 126, 234, 0.6);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.08);
}

.clear-btn {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 2px;
  border-radius: 6px;
  transition: all 150ms;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-btn:hover {
  color: #1e1b4b;
  background: #f3f4f6;
}

.clear-btn svg {
  width: 14px;
  height: 14px;
}

/* ── Category Chips ── */
.category-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.chip {
  padding: 6px 14px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #6b7280;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 150ms;
}

.chip:hover {
  color: #1e1b4b;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.chip.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-color: transparent;
  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.25);
}

/* ── Default Label ── */
.default-section {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 12px;
}

.default-label {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.default-count {
  font-size: 12px;
  color: #9ca3af;
  font-weight: 400;
}

/* ── Results Label ── */
.results-label {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.results-count {
  font-size: 12px;
  color: #9ca3af;
  font-weight: 400;
  text-transform: none;
  letter-spacing: normal;
}

/* ── Empty Result ── */
.empty-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 64px 20px;
  text-align: center;
}

.empty-result svg {
  width: 40px;
  height: 40px;
  color: #d1d5db;
  margin-bottom: 12px;
  opacity: 0.5;
}

.empty-result p {
  font-size: 14px;
  color: #9ca3af;
  margin: 0;
}

.empty-hint {
  font-size: 12px !important;
  color: #d1d5db !important;
  margin-top: 4px !important;
}

/* ── Result List ── */
.result-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.result-card {
  display: flex;
  gap: 16px;
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 200ms;
}

.result-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.result-card:hover .result-title {
  color: #667eea;
}

.result-cover {
  width: 56px;
  height: 80px;
  object-fit: cover;
  border-radius: 10px;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.result-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.result-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
}

.result-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e1b4b;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 150ms;
}

.result-author {
  font-size: 12px;
  color: #9ca3af;
  margin: 2px 0 0 0;
}

.result-tag {
  font-size: 11px;
  color: #6b7280;
  background: #f3f4f6;
  padding: 2px 8px;
  border-radius: 9999px;
  flex-shrink: 0;
}

.result-desc {
  font-size: 12px;
  line-height: 1.55;
  color: #9ca3af;
  margin: 8px 0 0 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.result-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 10px;
}

.rating-block {
  display: flex;
  align-items: center;
  gap: 4px;
}

.rating-block svg {
  width: 14px;
  height: 14px;
  fill: #f59e0b;
  stroke: #f59e0b;
}

.rating-value {
  font-size: 12px;
  font-weight: 700;
  color: #1e1b4b;
}

.rating-max {
  font-size: 11px;
  color: #9ca3af;
}

.btn-add {
  padding: 6px 16px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 150ms;
  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.25);
}

.btn-add:hover {
  opacity: 0.9;
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.35);
}

/* ── Spinner ── */
.spinner-wrap {
  display: flex;
  justify-content: center;
  padding: 64px 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(102, 126, 234, 0.1);
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ── Responsive ── */
@media (max-width: 480px) {
  .page-header {
    flex-direction: column;
    gap: 4px;
  }

  .result-card {
    flex-direction: column;
  }

  .result-cover {
    width: 72px;
    height: 96px;
  }

  .category-chips {
    overflow-x: auto;
    flex-wrap: nowrap;
    padding-bottom: 4px;
    -webkit-overflow-scrolling: touch;
  }

  .chip {
    flex-shrink: 0;
  }
}
</style>
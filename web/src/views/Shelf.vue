<template>
  <div class="page-container">
    <div class="page-content">
      <div class="shelf-page">
        <div class="shelf-header">
          <div>
            <h1 class="shelf-title">我的书架</h1>
            <p class="shelf-subtitle">共收录 {{ totalCount }} 本书籍</p>
          </div>
          <button class="add-book-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            添加书籍
          </button>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon stat-icon-time">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <p class="stat-value">{{ readingTime }}</p>
            <p class="stat-label">本月阅读</p>
          </div>
          <div class="stat-card">
            <div class="stat-icon stat-icon-fire">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
              </svg>
            </div>
            <p class="stat-value">{{ continuousDays }} 天</p>
            <p class="stat-label">连续天数</p>
          </div>
          <div class="stat-card">
            <div class="stat-icon stat-icon-target">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="6"></circle>
                <circle cx="12" cy="12" r="2"></circle>
              </svg>
            </div>
            <p class="stat-value">{{ finishedThisMonth }} 本</p>
            <p class="stat-label">本月读完</p>
          </div>
        </div>

        <div v-if="loading" class="spinner-container">
          <div class="spinner"></div>
        </div>

        <div v-else-if="error" class="error-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12" y2="16"></line>
          </svg>
          <p>{{ error }}</p>
        </div>

        <div v-else>
          <div class="filter-group">
            <button
              v-for="tab in filterTabs"
              :key="tab.key"
              class="filter-btn"
              :class="{ active: activeFilter === tab.key }"
              @click="activeFilter = tab.key"
            >
              {{ tab.label }}
              <span v-if="tab.key !== 'all'" class="filter-count">{{ tab.count }}</span>
            </button>
          </div>

          <div class="books-grid">
            <div
              v-for="book in filteredBooks"
              :key="book.bookId"
              class="book-card"
              @click="handleBookClick(book)"
            >
              <div class="book-cover-wrap">
                <img :src="book.cover" :alt="book.title" class="book-cover" />
                <div class="book-cover-overlay" />
                <span class="book-badge" :class="getStatusClass(book)">
                  {{ getStatusLabel(book) }}
                </span>
                <div v-if="book.finishReading !== 1 && getProgress(book) > 0" class="cover-progress-track">
                  <div class="cover-progress-fill" :style="{ width: getProgress(book) + '%' }" />
                </div>
              </div>
              <div class="book-body">
                <h3 class="book-title">{{ book.title }}</h3>
                <p class="book-author">{{ book.author }}</p>
                <div class="book-meta">
                  <div v-if="getReviewCount(book) > 0" class="book-stars">
                    <svg v-for="i in Math.min(5, getReviewCount(book))" :key="i" viewBox="0 0 24 24" class="star filled">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                  <span v-if="getNotesCount(book) > 0" class="book-notes">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                    </svg>
                    {{ getNotesCount(book) }}
                  </span>
                </div>
                <div v-if="book.finishReading !== 1 && getProgress(book) > 0" class="book-progress">
                  <div class="progress-row">
                    <span class="progress-pct">{{ getProgress(book) }}%</span>
                    <span class="unread-txt">{{ 100 - getProgress(book) }}% 未读</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: getProgress(book) + '%' }" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="filteredBooks.length === 0" class="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
            <span>暂无{{ getFilterLabel() }}书籍</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { wereadApi } from '@/api/weread'
import type { Book, NotebookBook } from '@/api/weread'

const books = ref<Book[]>([])
const loading = ref(true)
const error = ref('')
const activeFilter = ref('all')

const readingTime = ref('--')
const continuousDays = ref(0)
const finishedThisMonth = ref(0)

const notebookMap = ref<Record<string, NotebookBook>>({})

const totalCount = computed(() => books.value.length)

const getProgress = (book: Book): number => {
  if (book.finishReading === 1) return 100
  const nb = notebookMap.value[book.bookId]
  return nb?.readingProgress ?? 0
}

const getNotesCount = (book: Book): number => {
  const nb = notebookMap.value[book.bookId]
  return nb?.noteCount ?? 0
}

const getReviewCount = (book: Book): number => {
  const nb = notebookMap.value[book.bookId]
  return nb?.reviewCount ?? 0
}

const getStatusLabel = (book: Book): string => {
  if (book.finishReading === 1) return '已读'
  return '在读'
}

const getStatusClass = (book: Book): string => {
  if (book.finishReading === 1) return 'badge-done'
  return 'badge-reading'
}

const filterTabs = computed(() => [
  { key: 'all', label: '全部', count: books.value.length },
  { key: 'reading', label: '在读', count: books.value.filter(b => b.finishReading !== 1).length },
  { key: 'want', label: '想读', count: 2 },
  { key: 'finished', label: '已读', count: books.value.filter(b => b.finishReading === 1).length },
])

const filteredBooks = computed(() => {
  switch (activeFilter.value) {
    case 'reading':
      return books.value.filter(b => b.finishReading !== 1)
    case 'want':
      return books.value.filter(b => b.finishReading !== 1).slice(0, 2)
    case 'finished':
      return books.value.filter(b => b.finishReading === 1)
    default:
      return books.value
  }
})

const getFilterLabel = (): string => {
  const tab = filterTabs.value.find(t => t.key === activeFilter.value)
  return tab?.label || ''
}

const formatReadTime = (seconds: number): string => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

const loadShelf = async () => {
  loading.value = true
  error.value = ''

  try {
    const [shelfRes, noteRes] = await Promise.all([
      wereadApi.shelf(),
      wereadApi.notebooks(100),
    ])

    if (shelfRes.code === 0) {
      books.value = shelfRes.data.books || []
      finishedThisMonth.value = books.value.filter(b => b.finishReading === 1).length
    }

    if (noteRes.code === 0 && noteRes.data.books) {
      const map: Record<string, NotebookBook> = {}
      for (const nb of noteRes.data.books) {
        map[nb.bookId] = nb
      }
      notebookMap.value = map
    }

    const readDataRes = await wereadApi.readdata()
    if (readDataRes.code === 0) {
      const d = readDataRes.data
      readingTime.value = formatReadTime(d.totalReadTime)
      continuousDays.value = d.readDays
    }
  } catch (e) {
    error.value = '网络错误，请稍后重试'
  } finally {
    loading.value = false
  }
}

const handleBookClick = (book: Book) => {
  console.log('点击书籍:', book.title)
}

loadShelf()
</script>

<style scoped>
.shelf-page {
  padding: 0;
}

.shelf-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: var(--spacing-lg);
}

.shelf-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-foreground);
  margin: 0;
  letter-spacing: -0.02em;
}

.shelf-subtitle {
  font-size: 13px;
  color: var(--color-muted-foreground);
  margin: 2px 0 0 0;
}

.add-book-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 200ms;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

.add-book-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102,126,234,0.25);
}

.add-book-btn svg {
  width: 14px;
  height: 14px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.stat-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04);
}

.stat-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  margin-bottom: 8px;
}

.stat-icon svg {
  width: 16px;
  height: 16px;
}

.stat-icon-time {
  background: #f0eeff;
  color: #667eea;
}

.stat-icon-fire {
  background: #fff1f2;
  color: #f43f5e;
}

.stat-icon-target {
  background: #ecfdf5;
  color: #10b981;
}

.stat-value {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-foreground);
  margin: 0;
  line-height: 1.4;
}

.stat-label {
  font-size: 12px;
  color: var(--color-muted-foreground);
  margin: 2px 0 0 0;
}

.filter-group {
  display: flex;
  gap: 4px;
  background: #ede9fe;
  border-radius: 12px;
  padding: 4px;
  width: fit-content;
  margin-bottom: 20px;
}

.filter-btn {
  padding: 6px 16px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-muted-foreground);
  background: transparent;
  cursor: pointer;
  transition: all 150ms;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}

.filter-btn:hover {
  color: var(--color-foreground);
}

.filter-btn.active {
  background: #fff;
  color: var(--color-foreground);
  box-shadow: 0 1px 2px rgba(0,0,0,0.06);
}

.filter-count {
  font-size: 11px;
  opacity: 0.45;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

@media (min-width: 640px) {
  .books-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 900px) {
  .books-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (min-width: 1100px) {
  .books-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

@media (min-width: 1280px) {
  .books-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}

.book-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  cursor: pointer;
  transition: all 200ms;
}

.book-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.book-cover-wrap {
  position: relative;
  height: 144px;
  overflow: hidden;
  background: var(--color-muted);
}

.book-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.book-cover-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.22));
  pointer-events: none;
}

.book-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 2px 8px;
  font-size: 10px;
  font-weight: 600;
  border-radius: 9999px;
  backdrop-filter: blur(6px);
  line-height: 1.5;
  z-index: 1;
}

.badge-reading {
  background: rgba(99, 102, 241, 0.9);
  color: white;
}

.badge-done {
  background: rgba(16, 185, 129, 0.88);
  color: white;
}

.cover-progress-track {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: rgba(0, 0, 0, 0.18);
}

.cover-progress-fill {
  height: 100%;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 0 3px 0 0;
  transition: width 300ms;
}

.book-body {
  padding: 12px;
}

.book-title {
  font-size: 13px;
  font-weight: 600;
  color: #1e1b4b;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 150ms;
  line-height: 1.35;
  letter-spacing: -0.01em;
}

.book-card:hover .book-title {
  color: #667eea;
}

.book-author {
  font-size: 11px;
  font-weight: 400;
  color: #6b7280;
  margin: 3px 0 0 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: 0.01em;
}

.book-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
}

.book-stars {
  display: flex;
  gap: 2px;
}

.star {
  width: 12px;
  height: 12px;
  fill: #f59e0b;
  stroke: #f59e0b;
}

.book-notes {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  font-weight: 500;
  color: #9ca3af;
}

.book-notes svg {
  width: 12px;
  height: 12px;
}

.book-progress {
  margin-top: 8px;
}

.progress-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  font-size: 11px;
}

.progress-pct {
  color: #667eea;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.unread-txt {
  color: #9ca3af;
}

.progress-bar {
  height: 4px;
  background: var(--color-secondary);
  border-radius: 9999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 9999px;
  transition: width 300ms;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px;
  color: var(--color-muted-foreground);
  grid-column: 1 / -1;
}

.empty-state svg {
  width: 44px;
  height: 44px;
  margin-bottom: 12px;
  opacity: 0.28;
}

.empty-state span {
  font-size: 13px;
}

.spinner-container {
  display: flex;
  justify-content: center;
  padding: 60px 20px;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(102, 126, 234, 0.1);
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px;
  color: var(--color-destructive);
}

.error-state svg {
  width: 44px;
  height: 44px;
  margin-bottom: 12px;
  opacity: 0.45;
}

.error-state p {
  margin: 0;
  font-size: 13px;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .shelf-header {
    flex-direction: column;
    gap: 12px;
  }

  .add-book-btn {
    align-self: flex-start;
  }

  .filter-group {
    width: 100%;
    overflow-x: auto;
  }

  .books-grid {
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .books-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .book-body {
    padding: 10px;
  }

  .book-cover-wrap {
    height: 120px;
  }
}
</style>
<template>
  <div class="page-container">
    <NavBar />
    
    <div class="page-content">
      <div class="page-header">
        <h1 class="page-title">我的笔记</h1>
        <p class="page-subtitle">共 {{ totalNoteCount }} 条笔记 · {{ totalBookCount }} 本书</p>
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

      <div v-else class="notes-layout">
        <div class="books-sidebar">
          <div class="sidebar-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
            <span>有笔记的书籍</span>
          </div>
          
          <div class="sidebar-list">
            <div
              v-for="book in notebookBooks"
              :key="book.bookId"
              class="book-item"
              :class="{ active: selectedBookId === book.bookId }"
              @click="selectBook(book.bookId)"
            >
              <img :src="book.book.cover" :alt="book.book.title" class="book-thumb" />
              <div class="book-summary">
                <h4>{{ book.book.title }}</h4>
                <p>{{ book.book.author }}</p>
                <div class="note-stats">
                  <span class="stat">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="18" y1="20" x2="12" y2="14"></line>
                      <line x1="12" y1="20" x2="18" y2="14"></line>
                    </svg>
                    {{ book.noteCount }}
                  </span>
                  <span class="stat">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    {{ book.reviewCount }}
                  </span>
                  <span class="stat">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path>
                    </svg>
                    {{ book.bookmarkCount }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="notes-detail">
          <div v-if="!selectedBookId" class="empty-state">
            <div class="empty-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <span class="empty-text">请从左侧选择一本书查看笔记</span>
          </div>

          <div v-else-if="bookDetailLoading" class="spinner-container">
            <div class="spinner-sm"></div>
          </div>

          <div v-else-if="selectedBook" class="book-notes">
            <div class="book-header">
              <div class="book-cover-large">
                <img :src="selectedBook.book.cover" :alt="selectedBook.book.title" />
              </div>
              <div class="book-meta">
                <h2>{{ selectedBook.book.title }}</h2>
                <p>{{ selectedBook.book.author }}</p>
                <div class="progress-wrapper">
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: selectedBook.readingProgress + '%' }"></div>
                  </div>
                  <span class="progress-text">阅读进度: {{ Math.round(selectedBook.readingProgress) }}%</span>
                </div>
              </div>
              <button class="btn btn-primary export-btn" @click="exportMarkdown">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                导出 Markdown
              </button>
            </div>

            <div class="notes-tabs">
              <button
                class="tab-btn"
                :class="{ active: activeTab === 'highlights' }"
                @click="activeTab = 'highlights'"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="20" x2="12" y2="14"></line>
                  <line x1="12" y1="20" x2="18" y2="14"></line>
                </svg>
                划线 ({{ bookmarks.length }})
              </button>
              <button
                class="tab-btn"
                :class="{ active: activeTab === 'reviews' }"
                @click="activeTab = 'reviews'"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                想法 ({{ reviews.length }})
              </button>
            </div>

            <div v-if="activeTab === 'highlights'" class="highlights-list">
              <div v-if="bookmarks.length === 0" class="empty-notes">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
                <span>暂无划线</span>
              </div>
              <div
                v-for="(chapterBookmarks, chapterUid) in groupedBookmarks"
                :key="chapterUid"
                class="chapter-group"
              >
                <h3 class="chapter-title">{{ getChapterTitle(chapterUid) }}</h3>
                <div
                  v-for="bookmark in chapterBookmarks"
                  :key="bookmark.bookmarkId"
                  class="highlight-item"
                >
                  <p class="highlight-text">{{ bookmark.markText }}</p>
                  <div class="highlight-footer">
                    <span class="highlight-time">{{ formatTime(bookmark.createTime) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="reviews-list">
              <div v-if="reviews.length === 0" class="empty-notes">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span>暂无想法</span>
              </div>
              <div
                v-for="review in reviews"
                :key="review.reviewId"
                class="review-item"
              >
                <div v-if="review.chapterName" class="review-chapter">
                  {{ review.chapterName }}
                </div>
                <p class="review-content">{{ review.content }}</p>
                <div class="review-footer">
                  <span class="review-time">{{ formatTime(review.createTime) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { wereadApi } from '@/api/weread'
import { formatTime, generateMarkdown, downloadFile } from '@/utils'
import NavBar from '@/components/NavBar.vue'
import type { NotebookBook, Bookmark, Chapter, Review } from '@/api/weread'

const notebookBooks = ref<NotebookBook[]>([])
const totalBookCount = ref(0)
const totalNoteCount = ref(0)
const loading = ref(true)
const error = ref('')

const selectedBookId = ref('')
const selectedBook = ref<NotebookBook | null>(null)
const bookmarks = ref<Bookmark[]>([])
const chapters = ref<Chapter[]>([])
const reviews = ref<Review[]>([])
const bookDetailLoading = ref(false)
const activeTab = ref('highlights')

const groupedBookmarks = computed(() => {
  const groups: Record<number, Bookmark[]> = {}
  bookmarks.value.forEach(bookmark => {
    if (!groups[bookmark.chapterUid]) {
      groups[bookmark.chapterUid] = []
    }
    groups[bookmark.chapterUid].push(bookmark)
  })
  return groups
})

const getChapterTitle = (chapterUid: number): string => {
  const chapter = chapters.value.find(c => c.chapterUid === chapterUid)
  return chapter?.title || `章节 ${chapterUid}`
}

const loadNotebooks = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await wereadApi.notebooks(100)
    if (response.code === 0) {
      notebookBooks.value = response.data.books || []
      totalBookCount.value = response.data.totalBookCount || 0
      totalNoteCount.value = response.data.totalNoteCount || 0
    } else {
      error.value = response.msg || '获取笔记列表失败'
    }
  } catch (e) {
    error.value = '网络错误，请稍后重试'
  } finally {
    loading.value = false
  }
}

const selectBook = async (bookId: string) => {
  selectedBookId.value = bookId
  selectedBook.value = notebookBooks.value.find(b => b.bookId === bookId) || null
  bookDetailLoading.value = true

  try {
    const [bookmarksRes, reviewsRes] = await Promise.all([
      wereadApi.bookmarks(bookId),
      wereadApi.reviews(bookId, 0, 100)
    ])

    if (bookmarksRes.code === 0) {
      bookmarks.value = bookmarksRes.data.updated || []
      chapters.value = bookmarksRes.data.chapters || []
    }

    if (reviewsRes.code === 0) {
      reviews.value = reviewsRes.data.reviews?.map(r => r.review) || []
    }
  } catch (e) {
    error.value = '获取笔记详情失败'
  } finally {
    bookDetailLoading.value = false
  }
}

const exportMarkdown = () => {
  if (!selectedBook.value) return

  const markdown = generateMarkdown(
    bookmarks.value,
    reviews.value,
    chapters.value,
    selectedBook.value.book.title,
    selectedBook.value.book.author
  )

  const filename = `${selectedBook.value.book.title}-笔记.md`
  downloadFile(markdown, filename)
}

onMounted(() => {
  loadNotebooks()
})
</script>

<style scoped>
.notes-layout {
  display: flex;
  gap: var(--spacing-lg);
  margin-top: var(--spacing-xl);
}

.books-sidebar {
  width: 360px;
  flex-shrink: 0;
  background: var(--color-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  max-height: calc(100vh - 220px);
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border);
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg);
  background: var(--color-primary);
  color: var(--color-primary-foreground);
  font-weight: 600;
  font-size: var(--font-size-base);
}

.sidebar-header svg {
  width: 22px;
  height: 22px;
}

.sidebar-list {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-sm);
}

.book-item {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  margin-bottom: var(--spacing-xs);
}

.book-item:hover {
  background: var(--color-secondary);
}

.book-item.active {
  background: var(--color-primary-glass);
  border-left: 3px solid var(--color-primary);
}

.book-thumb {
  width: 56px;
  height: 74px;
  object-fit: cover;
  border-radius: var(--radius-sm);
  flex-shrink: 0;
}

.book-summary {
  flex: 1;
  min-width: 0;
}

.book-summary h4 {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-foreground);
  margin: 0 0 var(--spacing-xs) 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.book-summary p {
  font-size: var(--font-size-xs);
  color: var(--color-muted-foreground);
  margin: 0 0 var(--spacing-sm) 0;
}

.note-stats {
  display: flex;
  gap: var(--spacing-md);
}

.note-stats .stat {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: var(--font-size-xs);
  color: var(--color-muted-foreground);
}

.note-stats .stat svg {
  width: 12px;
  height: 12px;
}

.notes-detail {
  flex: 1;
  background: var(--color-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  min-height: 400px;
  border: 1px solid var(--color-border);
}

.empty-notes {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-3xl);
  color: var(--color-muted-foreground);
}

.empty-notes svg {
  width: 48px;
  height: 48px;
  margin-bottom: var(--spacing-md);
  opacity: 0.4;
}

.empty-notes span {
  font-size: var(--font-size-base);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-3xl);
}

.empty-icon-wrap {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-secondary);
  border-radius: var(--radius-xl);
  margin-bottom: var(--spacing-lg);
}

.empty-icon-wrap svg {
  width: 40px;
  height: 40px;
  color: var(--color-muted-foreground);
}

.empty-text {
  font-size: var(--font-size-base);
  color: var(--color-muted-foreground);
}

.book-notes {
  padding: var(--spacing-lg);
}

.book-header {
  display: flex;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.book-cover-large {
  width: 110px;
  height: 146px;
  flex-shrink: 0;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.book-cover-large img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-meta {
  flex: 1;
}

.book-meta h2 {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--color-foreground);
  margin: 0 0 var(--spacing-sm) 0;
}

.book-meta p {
  font-size: var(--font-size-sm);
  color: var(--color-muted-foreground);
  margin: 0 0 var(--spacing-md) 0;
}

.progress-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.progress-bar {
  height: 8px;
  background: var(--color-secondary);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: var(--radius-full);
  transition: width var(--transition-normal);
}

.progress-text {
  font-size: var(--font-size-xs);
  color: var(--color-muted-foreground);
}

.export-btn {
  align-self: flex-start;
  padding: var(--spacing-sm) var(--spacing-lg);
  gap: var(--spacing-sm);
}

.export-btn svg {
  width: 16px;
  height: 16px;
}

.notes-tabs {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-lg);
  border: none;
  background: var(--color-secondary);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-muted-foreground);
  transition: all var(--transition-fast);
}

.tab-btn svg {
  width: 16px;
  height: 16px;
}

.tab-btn:hover {
  background: var(--color-secondary);
  opacity: 0.8;
}

.tab-btn.active {
  background: var(--color-primary);
  color: var(--color-primary-foreground);
  box-shadow: var(--shadow-sm);
}

.highlights-list,
.reviews-list {
  max-height: calc(100vh - 380px);
  overflow-y: auto;
}

.chapter-group {
  margin-bottom: var(--spacing-xl);
}

.chapter-title {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-foreground);
  margin: 0 0 var(--spacing-md) 0;
  padding-left: var(--spacing-md);
  border-left: 4px solid var(--color-primary);
}

.highlight-item {
  background: var(--color-secondary);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
  transition: all var(--transition-fast);
}

.highlight-item:hover {
  background: var(--color-secondary);
  opacity: 0.8;
}

.highlight-text {
  font-size: var(--font-size-sm);
  line-height: 1.8;
  color: var(--color-foreground);
  margin: 0 0 var(--spacing-sm) 0;
}

.highlight-footer {
  display: flex;
  justify-content: flex-end;
}

.highlight-time {
  font-size: var(--font-size-xs);
  color: var(--color-muted-foreground);
}

.review-item {
  background: rgba(245, 158, 11, 0.08);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
  border-left: 4px solid var(--color-warning);
}

.review-chapter {
  font-size: var(--font-size-sm);
  color: var(--color-warning);
  font-weight: 500;
  margin: 0 0 var(--spacing-sm) 0;
}

.review-content {
  font-size: var(--font-size-sm);
  line-height: 1.8;
  color: var(--color-foreground);
  margin: 0 0 var(--spacing-sm) 0;
}

.review-footer {
  display: flex;
  justify-content: flex-end;
}

.review-time {
  font-size: var(--font-size-xs);
  color: var(--color-muted-foreground);
}

.spinner-container {
  display: flex;
  justify-content: center;
  padding: var(--spacing-3xl);
}

.spinner {
  width: 44px;
  height: 44px;
  border: 3px solid rgba(102, 126, 234, 0.1);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.spinner-sm {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(102, 126, 234, 0.1);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-3xl);
  color: var(--color-destructive);
}

.error-state svg {
  width: 64px;
  height: 64px;
  margin-bottom: var(--spacing-md);
  opacity: 0.5;
}

.error-state p {
  margin: 0;
  font-size: var(--font-size-base);
}

@media (max-width: 900px) {
  .notes-layout {
    flex-direction: column;
  }
  
  .books-sidebar {
    width: 100%;
    max-height: 240px;
  }
  
  .book-header {
    flex-direction: column;
  }
  
  .book-cover-large {
    width: 100%;
    height: auto;
    aspect-ratio: 3/4;
  }
  
  .book-cover-large img {
    width: 100%;
    height: 100%;
  }
  
  .export-btn {
    align-self: flex-start;
    margin-top: var(--spacing-md);
  }
}
</style>
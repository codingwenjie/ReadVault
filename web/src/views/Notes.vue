<template>
  <div class="page-container">
    <div class="page-content">
      <div class="page-header">
        <h1 class="page-title">我的笔记</h1>
        <p class="page-subtitle">共 {{ totalNoteCount }} 条笔记 · {{ totalBookCount }} 本书</p>
      </div>

      <div v-if="showSearchResults" class="search-results-container">
        <div class="search-results-header">
          <span class="results-count">找到 {{ searchResults.length }} 条结果</span>
        </div>
        <div class="search-results-list">
          <div
            v-for="(result, index) in searchResults"
            :key="index"
            class="search-result-item"
            @click="handleSearchResultClick(result)"
          >
            <div class="result-type">
              <span :class="['type-badge', result.type]">{{ result.type === 'bookmark' ? '划线' : '想法' }}</span>
            </div>
            <div class="result-content">
              <p class="result-text">{{ highlightKeyword(result.type === 'bookmark' ? (result.item as Bookmark).markText : (result.item as Review).content) }}</p>
              <span class="result-book">{{ result.bookTitle }}</span>
            </div>
          </div>
          <div v-if="searchResults.length === 0" class="no-search-results">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span>没有找到匹配的笔记</span>
          </div>
        </div>
      </div>

      <div v-if="loading && !showSearchResults" class="spinner-container">
        <div class="spinner"></div>
      </div>

      <div v-else-if="error && !showSearchResults" class="error-state">
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
            <div class="header-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
            </div>
            <div class="header-content">
              <span class="header-title">有笔记的书籍</span>
              <span class="header-count">{{ totalBookCount }} 本书</span>
            </div>
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
                  <span class="stat stat-highlight">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                    </svg>
                    {{ book.noteCount }}
                  </span>
                  <span class="stat stat-review">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    {{ book.reviewCount }}
                  </span>
                </div>
              </div>
              <div class="book-item-arrow" v-if="selectedBookId === book.bookId">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
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
                <div class="book-progress-badge">{{ Math.round(selectedBook.readingProgress) }}%</div>
              </div>
              <div class="book-meta">
                <h2>{{ selectedBook.book.title }}</h2>
                <p class="book-author">{{ selectedBook.book.author }}</p>
                <div class="progress-wrapper">
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: selectedBook.readingProgress + '%' }"></div>
                  </div>
                  <span class="progress-text">阅读进度</span>
                </div>
              </div>
              <div class="export-dropdown">
                <button class="btn btn-primary export-btn" @click="showExportMenu = !showExportMenu">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  导出
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="dropdown-arrow">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                <div v-if="showExportMenu" class="export-menu" @click.self="showExportMenu = false">
                  <button class="export-menu-item" @click="exportMarkdown">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    Markdown (.md)
                  </button>
                  <button class="export-menu-item" @click="exportTxt">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    TXT (.txt)
                  </button>
                </div>
              </div>
            </div>

            <div class="notes-tabs">
              <button
                class="tab-btn"
                :class="{ active: activeTab === 'highlights' }"
                @click="activeTab = 'highlights'"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                </svg>
                划线
                <span class="tab-count">{{ bookmarks.length }}</span>
              </button>
              <button
                class="tab-btn"
                :class="{ active: activeTab === 'reviews' }"
                @click="activeTab = 'reviews'"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                想法
                <span class="tab-count">{{ reviews.length }}</span>
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
                <div class="chapter-header">
                  <div class="chapter-dot"></div>
                  <h3 class="chapter-title">{{ getChapterTitle(chapterUid) }}</h3>
                  <span class="chapter-count">{{ chapterBookmarks.length }} 条</span>
                </div>
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
                <div class="review-header">
                  <div v-if="review.chapterName" class="review-chapter">
                    {{ review.chapterName }}
                  </div>
                  <span class="review-time">{{ formatTime(review.createTime) }}</span>
                </div>
                <p class="review-content">{{ review.content }}</p>
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
import { formatTime, generateMarkdown, generateTxt, downloadFile } from '@/utils'
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
const showExportMenu = ref(false)

const searchKeyword = ref('')
const searchResults = ref<{ type: 'bookmark' | 'review'; item: Bookmark | Review; bookId: string; bookTitle: string }[]>([])
const showSearchResults = ref(false)

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

const getChapterTitle = (chapterUid: string | number): string => {
  const uid = Number(chapterUid)
  const chapter = chapters.value.find(c => c.chapterUid === uid)
  return chapter?.title || `章节 ${uid}`
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

const handleSearchResultClick = async (result: { type: 'bookmark' | 'review'; item: Bookmark | Review; bookId: string; bookTitle: string }) => {
  await selectBook(result.bookId)
  activeTab.value = result.type
}

const highlightKeyword = (text: string | undefined): string => {
  if (!text || !searchKeyword.value) return text || ''
  const keyword = searchKeyword.value
  const regex = new RegExp(`(${keyword})`, 'gi')
  return text.replace(regex, '<mark class="highlight">$1</mark>')
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
  showExportMenu.value = false
}

const exportTxt = () => {
  if (!selectedBook.value) return

  const txt = generateTxt(
    bookmarks.value,
    reviews.value,
    chapters.value,
    selectedBook.value.book.title,
    selectedBook.value.book.author
  )

  const filename = `${selectedBook.value.book.title}-笔记.txt`
  downloadFile(txt, filename, 'text/plain')
  showExportMenu.value = false
}

onMounted(() => {
  loadNotebooks()
})
</script>

<style scoped>
.notes-layout {
  display: flex;
  gap: 24px;
  margin-top: 0;
}

.books-sidebar {
  width: 208px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 180px);
}

.sidebar-header {
  display: none;
}

.sidebar-list {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

.sidebar-list::-webkit-scrollbar {
  width: 5px;
}

.sidebar-list::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-list::-webkit-scrollbar-thumb {
  background: rgba(102, 126, 234, 0.2);
  border-radius: 10px;
}

.sidebar-list::-webkit-scrollbar-thumb:hover {
  background: rgba(102, 126, 234, 0.35);
}

.book-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 10px;
  border-radius: 0;
  cursor: pointer;
  transition: all 150ms;
  margin-bottom: 0;
  position: relative;
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(229, 231, 235, 0.5);
}

.book-item:last-child {
  border-bottom: none;
}

.book-item:hover {
  background: rgba(255, 255, 255, 0.6);
}

.book-item.active {
  background: rgba(102, 126, 234, 0.06);
  border-bottom: 1px solid rgba(229, 231, 235, 0.5);
}

.book-item.active:last-child {
  border-bottom: none;
}

.book-thumb {
  width: 36px;
  height: 48px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}

.book-summary {
  flex: 1;
  min-width: 0;
}

.book-summary h4 {
  font-size: 14px;
  font-weight: 500;
  color: #1e1b4b;
  margin: 0 0 2px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  letter-spacing: -0.01em;
}

.book-item.active .book-summary h4 {
  color: #667eea;
}

.book-summary p {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}

.note-stats {
  display: flex;
  gap: 10px;
  margin-top: 4px;
}

.note-stats .stat {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  font-weight: 500;
}

.stat-highlight {
  color: #667eea;
}

.stat-review {
  color: #f59e0b;
}

.note-stats .stat svg {
  width: 11px;
  height: 11px;
}

.notes-detail {
  flex: 1;
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

.empty-notes {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 64px 20px;
  color: #9ca3af;
}

.empty-notes svg {
  width: 40px;
  height: 40px;
  margin-bottom: 12px;
  opacity: 0.25;
}

.empty-notes span {
  font-size: 14px;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 20px;
}

.empty-icon-wrap {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border-radius: 16px;
  margin-bottom: 16px;
}

.empty-icon-wrap svg {
  width: 40px;
  height: 40px;
  color: #9ca3af;
}

.empty-text {
  font-size: 14px;
  color: #6b7280;
}

.book-notes {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.book-header {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  padding: 16px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.book-cover-large {
  position: relative;
  width: 48px;
  height: 64px;
  flex-shrink: 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

.book-cover-large img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-progress-badge {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.65);
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 8px;
  text-align: right;
  backdrop-filter: blur(4px);
}

.book-meta {
  flex: 1;
}

.book-meta h2 {
  font-size: 16px;
  font-weight: 600;
  color: #1e1b4b;
  margin: 0 0 4px 0;
}

.book-author {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 8px 0;
}

.progress-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: #f3f4f6;
  border-radius: 9999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 9999px;
  transition: width 300ms;
}

.progress-text {
  font-size: 12px;
  color: #9ca3af;
  white-space: nowrap;
}

.export-btn {
  align-self: flex-start;
  padding: 8px 16px;
  gap: 8px;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 150ms;
}

.export-btn:hover {
  opacity: 0.95;
  transform: translateY(-1px);
}

.export-btn svg {
  width: 14px;
  height: 14px;
}

.dropdown-arrow {
  width: 12px;
  height: 12px;
  margin-left: 4px;
  transition: transform 200ms;
}

.export-btn:hover .dropdown-arrow {
  transform: rotate(180deg);
}

.export-dropdown {
  position: relative;
}

.export-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border: 1px solid #e5e7eb;
  min-width: 180px;
  z-index: 100;
  overflow: hidden;
}

.export-menu-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 13px;
  color: #1e1b4b;
  transition: background 150ms;
  text-align: left;
}

.export-menu-item:hover {
  background: #f3f4f6;
}

.export-menu-item svg {
  width: 14px;
  height: 14px;
  color: #9ca3af;
}

.notes-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  border: none;
  background: #f3f4f6;
  border-radius: 10px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  transition: all 150ms;
}

.tab-btn svg {
  width: 14px;
  height: 14px;
}

.tab-count {
  background: rgba(0, 0, 0, 0.06);
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 11px;
}

.tab-btn:hover {
  background: #e5e7eb;
  opacity: 0.9;
}

.tab-btn.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.25);
}

.tab-btn.active .tab-count {
  background: rgba(255, 255, 255, 0.2);
}

.highlights-list,
.reviews-list {
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
}

.chapter-group {
  margin-bottom: 24px;
}

.chapter-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.chapter-dot {
  width: 8px;
  height: 8px;
  background: #667eea;
  border-radius: 50%;
}

.chapter-title {
  font-size: 15px;
  font-weight: 600;
  color: #1e1b4b;
  margin: 0;
}

.chapter-count {
  font-size: 12px;
  color: #9ca3af;
  background: #f3f4f6;
  padding: 2px 10px;
  border-radius: 9999px;
  margin-left: auto;
}

.highlight-item {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 12px;
  transition: all 200ms;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.highlight-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.highlight-quote {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(102, 126, 234, 0.06);
  border-radius: 8px;
  color: #667eea;
  margin-bottom: 10px;
}

.highlight-quote svg {
  width: 12px;
  height: 12px;
}

.highlight-text {
  font-size: 14px;
  line-height: 1.7;
  color: #1e1b4b;
  margin: 0 0 10px 0;
  font-weight: 500;
  border-left: 3px solid #667eea;
  padding-left: 14px;
}

.highlight-footer {
  display: flex;
  justify-content: flex-end;
}

.highlight-time {
  font-size: 12px;
  color: #9ca3af;
}

.review-item {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 200ms;
}

.review-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.review-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.review-chapter {
  font-size: 13px;
  color: #f59e0b;
  font-weight: 500;
  background: #fffbeb;
  padding: 4px 10px;
  border-radius: 9999px;
}

.review-time {
  font-size: 12px;
  color: #9ca3af;
}

.review-content {
  font-size: 14px;
  line-height: 1.7;
  color: #6b7280;
  margin: 0;
}

.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
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

.spinner-sm {
  width: 30px;
  height: 30px;
  border: 3px solid rgba(102, 126, 234, 0.1);
  border-top-color: #667eea;
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
  padding: 64px 20px;
  color: #ef4444;
}

.error-state svg {
  width: 60px;
  height: 60px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.error-state p {
  margin: 0;
  font-size: 14px;
}

.search-box-wrapper {
  width: 100%;
  max-width: 400px;
  margin-top: 16px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  transition: all 150ms;
}

.search-box:focus-within {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.08);
}

.search-box svg {
  width: 16px;
  height: 16px;
  color: #9ca3af;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 14px;
  color: #1e1b4b;
  outline: none;
}

.search-input::placeholder {
  color: #9ca3af;
}

.search-clear {
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 2px;
  border-radius: 6px;
  transition: all 150ms;
}

.search-clear:hover {
  background: #f3f4f6;
}

.search-results-container {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  margin-bottom: 16px;
  overflow: hidden;
}

.search-results-header {
  padding: 12px 18px;
  border-bottom: 1px solid #e5e7eb;
  background: #f8f7ff;
}

.results-count {
  font-size: 13px;
  color: #6b7280;
}

.search-results-list {
  max-height: 400px;
  overflow-y: auto;
}

.search-result-item {
  display: flex;
  gap: 14px;
  padding: 14px 18px;
  border-bottom: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 150ms;
}

.search-result-item:hover {
  background: #f8f7ff;
}

.search-result-item:last-child {
  border-bottom: none;
}

.result-type {
  flex-shrink: 0;
}

.type-badge {
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 500;
}

.type-badge.bookmark {
  background: rgba(102, 126, 234, 0.08);
  color: #667eea;
}

.type-badge.review {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.result-content {
  flex: 1;
  min-width: 0;
}

.result-text {
  font-size: 14px;
  line-height: 1.6;
  color: #1e1b4b;
  margin: 0 0 4px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.result-text .highlight {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  padding: 1px 3px;
  border-radius: 2px;
}

.result-book {
  font-size: 12px;
  color: #9ca3af;
}

.no-search-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 20px;
  color: #9ca3af;
}

.no-search-results svg {
  width: 40px;
  height: 40px;
  margin-bottom: 12px;
  opacity: 0.5;
}

@media (max-width: 900px) {
  .notes-layout {
    flex-direction: column;
  }

  .books-sidebar {
    width: 100%;
    max-height: 280px;
  }

  .book-header {
    flex-direction: column;
    gap: 16px;
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

  .book-progress-badge {
    text-align: center;
  }

  .export-btn {
    align-self: stretch;
    justify-content: center;
    margin-top: 12px;
  }

  .progress-wrapper {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .progress-bar {
    width: 100%;
  }
}
</style>
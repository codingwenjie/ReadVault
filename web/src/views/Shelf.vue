<template>
  <div class="page-container">
    <NavBar />
    
    <div class="page-content">
      <div class="page-header">
        <h1 class="page-title">我的书架</h1>
        <div class="stats-bar">
          <div class="stat-item">
            <div class="stat-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ bookCount }}</span>
              <span class="stat-label">电子书</span>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 19V6l12-3v13"></path>
                <circle cx="6" cy="18" r="3"></circle>
                <circle cx="18" cy="16" r="3"></circle>
              </svg>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ albumCount }}</span>
              <span class="stat-label">有声书</span>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ totalCount }}</span>
              <span class="stat-label">总条目</span>
            </div>
          </div>
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
        <div class="books-grid">
          <div
            v-for="book in books"
            :key="book.bookId"
            class="book-card"
            :class="{ 'is-finished': book.finishReading === 1 }"
            @click="handleBookClick(book)"
          >
            <div class="book-cover-wrapper">
              <img :src="book.cover" :alt="book.title" class="book-cover" />
              <div class="book-overlay">
                <div v-if="book.isTop === 1" class="badge badge-warning">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                  置顶
                </div>
                <div v-if="book.finishReading === 1" class="badge badge-success">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  已读完
                </div>
              </div>
            </div>
            <div class="book-info">
              <h3 class="book-title">{{ book.title }}</h3>
              <p class="book-author">{{ book.author }}</p>
              <div class="book-meta">
                <span class="book-category">{{ book.category }}</span>
                <span class="book-update-time">{{ formatTime(book.readUpdateTime) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="albums.length > 0" class="section">
          <div class="section-header">
            <div class="section-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 19V6l12-3v13"></path>
                <circle cx="6" cy="18" r="3"></circle>
                <circle cx="18" cy="16" r="3"></circle>
              </svg>
              <span>有声书</span>
            </div>
            <span class="section-count">{{ albums.length }} 本</span>
          </div>
          <div class="albums-grid">
            <div
              v-for="album in albums"
              :key="album.albumInfo.albumId"
              class="album-card"
              @click="handleAlbumClick(album)"
            >
              <div class="album-cover-wrapper">
                <img :src="album.albumInfo.cover" :alt="album.albumInfo.name" class="album-cover" />
                <div class="album-badge">{{ album.albumInfo.finishStatus }}</div>
              </div>
              <div class="album-info">
                <h3 class="album-title">{{ album.albumInfo.name }}</h3>
                <p class="album-author">{{ album.albumInfo.authorName }}</p>
                <div class="album-meta">
                  <span class="meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    {{ album.albumInfo.trackCount }} 集
                  </span>
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
import { formatTime } from '@/utils'
import NavBar from '@/components/NavBar.vue'
import type { Book, Album } from '@/api/weread'

const books = ref<Book[]>([])
const albums = ref<Album[]>([])
const loading = ref(true)
const error = ref('')

const bookCount = computed(() => books.value.length)
const albumCount = computed(() => albums.value.length)
const totalCount = computed(() => bookCount.value + albumCount.value)

const loadShelf = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await wereadApi.shelf()
    if (response.code === 0) {
      books.value = response.data.books || []
      albums.value = response.data.albums || []
    } else {
      error.value = response.msg || '获取书架失败'
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

const handleAlbumClick = (album: Album) => {
  console.log('点击有声书:', album.albumInfo.name)
}

onMounted(() => {
  loadShelf()
})
</script>

<style scoped>
.stats-bar {
  display: flex;
  gap: var(--spacing-lg);
  margin-top: var(--spacing-lg);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--color-card);
  border-radius: var(--radius-lg);
  min-width: 140px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
  transition: all var(--transition-fast);
}

.stat-item:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.stat-icon-wrap {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary-glass);
  border-radius: var(--radius-md);
  color: var(--color-primary);
}

.stat-icon-wrap svg {
  width: 20px;
  height: 20px;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--color-primary);
  line-height: 1.2;
}

.stat-label {
  font-size: var(--font-size-xs);
  color: var(--color-muted-foreground);
  margin-top: 2px;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: var(--spacing-lg);
  margin-top: var(--spacing-xl);
}

.book-card {
  background: var(--color-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.book-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.book-card.is-finished {
  border-color: var(--color-success);
}

.book-cover-wrapper {
  position: relative;
  aspect-ratio: 3/4;
  overflow: hidden;
}

.book-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.book-card:hover .book-cover {
  transform: scale(1.03);
}

.book-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: var(--spacing-sm);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  pointer-events: none;
}

.book-overlay .badge {
  pointer-events: auto;
  gap: 4px;
}

.book-overlay .badge svg {
  width: 12px;
  height: 12px;
}

.book-info {
  padding: var(--spacing-md);
}

.book-title {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-foreground);
  margin: 0 0 var(--spacing-xs) 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.4;
}

.book-author {
  font-size: var(--font-size-xs);
  color: var(--color-muted-foreground);
  margin: 0 0 var(--spacing-sm) 0;
}

.book-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.book-category {
  font-size: var(--font-size-xs);
  color: var(--color-muted-foreground);
  background: var(--color-secondary);
  padding: 2px 8px;
  border-radius: var(--radius-md);
}

.book-update-time {
  font-size: var(--font-size-xs);
  color: var(--color-muted-foreground);
}

.section {
  margin-top: var(--spacing-2xl);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-lg);
}

.section-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-foreground);
}

.section-title svg {
  width: 22px;
  height: 22px;
  color: var(--color-primary);
}

.section-count {
  font-size: var(--font-size-sm);
  color: var(--color-muted-foreground);
  background: var(--color-secondary);
  padding: 4px 12px;
  border-radius: var(--radius-full);
}

.albums-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: var(--spacing-lg);
}

.album-card {
  background: var(--color-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.album-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.album-cover-wrapper {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
}

.album-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.album-card:hover .album-cover {
  transform: scale(1.03);
}

.album-badge {
  position: absolute;
  bottom: var(--spacing-sm);
  right: var(--spacing-sm);
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: var(--font-size-xs);
  padding: 3px 8px;
  border-radius: var(--radius-md);
}

.album-info {
  padding: var(--spacing-md);
}

.album-title {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-foreground);
  margin: 0 0 var(--spacing-xs) 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.album-author {
  font-size: var(--font-size-xs);
  color: var(--color-muted-foreground);
  margin: 0 0 var(--spacing-sm) 0;
}

.album-meta {
  display: flex;
  gap: var(--spacing-md);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: var(--font-size-xs);
  color: var(--color-muted-foreground);
}

.meta-item svg {
  width: 12px;
  height: 12px;
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

@media (max-width: 768px) {
  .stats-bar {
    gap: var(--spacing-md);
    flex-wrap: wrap;
  }
  
  .stat-item {
    min-width: calc(50% - 8px);
    padding: var(--spacing-sm) var(--spacing-md);
  }
  
  .stat-value {
    font-size: var(--font-size-lg);
  }
  
  .books-grid,
  .albums-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: var(--spacing-md);
  }
  
  .book-title,
  .album-title {
    font-size: var(--font-size-xs);
  }
}
</style>
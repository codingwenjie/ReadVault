<template>
  <div class="page-container">
    <div class="page-content">
      <div class="page-header">
        <h1 class="page-title">发现好书</h1>
        <p class="page-subtitle">为你精选推荐</p>
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

      <div v-else class="discover-content">
        <!-- Featured Hero Card -->
        <div v-if="featuredBook" class="featured-card">
          <div class="featured-bg"></div>
          <div class="featured-decor decor-1"></div>
          <div class="featured-decor decor-2"></div>
          <div class="featured-body">
            <div class="featured-tags">
              <span class="tag-editor">✦ 编辑精选</span>
              <span class="tag-category">{{ featuredBook.category || '精选' }}</span>
            </div>
            <h2 class="featured-title">{{ featuredBook.title }}</h2>
            <p class="featured-author">{{ featuredBook.author }}</p>
            <p class="featured-desc">{{ featuredBook.intro || '一本值得阅读的好书' }}</p>
            <div class="featured-meta">
              <div class="meta-rating">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <span>{{ featuredBook.newRating ? featuredBook.newRating.toFixed(1) : '--' }}</span>
              </div>
              <span class="meta-readers">{{ formatReadCount(featuredBook.readingCount) }}人在读</span>
            </div>
            <button class="btn-add-shelf">加入书架</button>
          </div>
        </div>

        <!-- Two Column Layout -->
        <div class="two-col-layout">
          <!-- Hot Rankings (Left) -->
          <div class="hot-section">
            <div class="hot-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
              <h3>热门榜单</h3>
            </div>
            <div class="hot-list">
              <div
                v-for="(book, index) in hotBooks"
                :key="book.bookId"
                class="hot-item"
                @click="handleBookClick(book)"
              >
                <span class="hot-rank" :class="getRankClass(index)">{{ index + 1 }}</span>
                <div class="hot-info">
                  <p class="hot-title">{{ book.title }}</p>
                  <p class="hot-author">{{ book.author }}</p>
                </div>
                <div class="hot-heat">
                  <div class="heat-bar"><div class="heat-fill" :style="{ width: getHeatPercent(index) + '%' }"></div></div>
                  <span class="heat-value">{{ getHeatValue(index) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Similar Recommendations (Right) -->
          <div class="similar-section">
            <h3 class="similar-header">相似推荐</h3>
            <div class="similar-list">
              <div
                v-for="book in similarBooks"
                :key="book.book.bookInfo?.bookId || String(book.idx)"
                class="similar-item"
                @click="handleSimilarClick(book)"
              >
                <img
                  :src="book.book?.bookInfo?.cover"
                  :alt="book.book?.bookInfo?.title"
                  class="similar-cover"
                />
                <div class="similar-info">
                  <div class="similar-top">
                    <div>
                      <h4 class="similar-title">{{ book.book?.bookInfo?.title }}</h4>
                      <p class="similar-author">{{ book.book?.bookInfo?.author }}</p>
                    </div>
                    <span class="similar-tag">{{ book.book?.bookInfo?.category || '推荐' }}</span>
                  </div>
                  <p class="similar-desc">{{ book.book?.bookInfo?.intro || '' }}</p>
                  <div class="similar-footer">
                    <div class="similar-rating">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                      <span>--</span>
                    </div>
                    <button class="btn-add-sm">+ 加入书架</button>
                  </div>
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
import type { RecommendBook, SimilarBook } from '@/api/weread'

const recommendations = ref<RecommendBook[]>([])
const hotBooks = ref<RecommendBook[]>([])
const similarBooks = ref<SimilarBook[]>([])
const loading = ref(true)
const error = ref('')

const featuredBook = computed(() => recommendations.value[0] || null)

const formatReadCount = (count?: number): string => {
  if (!count) return ''
  if (count >= 10000) return `${(count / 10000).toFixed(1)}万`
  return `${count}`
}

const getRankClass = (index: number): string => {
  if (index === 0) return 'rank-1'
  if (index === 1) return 'rank-2'
  if (index === 2) return 'rank-3'
  return ''
}

const heatValues = [98, 95, 91, 88, 84]
const getHeatPercent = (index: number): number => {
  return heatValues[index] || 70
}
const getHeatValue = (index: number): number => {
  return heatValues[index] || 70
}

const loadDiscover = async () => {
  loading.value = true
  error.value = ''

  try {
    const [recommendRes] = await Promise.all([
      wereadApi.recommend(6),
    ])

    if (recommendRes.code === 0) {
      const books = recommendRes.data.books || []
      recommendations.value = books
      hotBooks.value = books.slice(0, 5)
      similarBooks.value = []
    } else {
      error.value = recommendRes.msg || '获取发现内容失败'
    }

    if (recommendations.value.length > 0) {
      try {
        const similarRes = await wereadApi.similar(recommendations.value[0].bookId, 6)
        if (similarRes.code === 0) {
          similarBooks.value = similarRes.data.booksimilar?.books || []
        }
      } catch (_) {}
    }

    if (similarBooks.value.length === 0 && hotBooks.value.length > 1) {
      similarBooks.value = hotBooks.value.slice(1).map(b => ({
        book: { bookInfo: b },
        similarity: 80 - Math.random() * 30,
      })) as unknown as SimilarBook[]
    }
  } catch (e) {
    error.value = '网络错误，请稍后重试'
  } finally {
    loading.value = false
  }
}

const handleBookClick = (book: RecommendBook | { bookId: string; title: string }) => {
  console.log('点击书籍:', book.title)
}

const handleSimilarClick = (book: SimilarBook) => {
  const info = book.book?.bookInfo
  console.log('点击相似书籍:', info?.title)
}

onMounted(() => {
  loadDiscover()
})
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

.page-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 2px 0 0 0;
}

/* ── Featured Hero Card ── */
.featured-card {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #a78bfa 100%);
  border-radius: 16px;
  padding: 28px;
  color: white;
  overflow: hidden;
  margin-bottom: 24px;
  max-height: 280px;
}

.featured-bg {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.15);
}

.featured-decor {
  position: absolute;
  border-radius: 50%;
}

.decor-1 {
  top: -48px;
  right: -48px;
  width: 160px;
  height: 160px;
  background: rgba(255, 255, 255, 0.1);
}

.decor-2 {
  bottom: -32px;
  left: -32px;
  width: 96px;
  height: 96px;
  background: rgba(255, 255, 255, 0.05);
}

.featured-body {
  position: relative;
  z-index: 1;
}

.featured-tags {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.tag-editor {
  font-size: 11px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.tag-category {
  font-size: 11px;
  opacity: 0.7;
}

.featured-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 4px 0;
}

.featured-author {
  font-size: 14px;
  opacity: 0.75;
  margin: 0 0 12px 0;
}

.featured-desc {
  font-size: 14px;
  line-height: 1.55;
  opacity: 0.9;
  max-width: 400px;
  margin: 0 0 16px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.featured-meta {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 18px;
}

.meta-rating {
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 600;
}

.meta-rating svg {
  width: 16px;
  height: 16px;
  fill: #fcd34d;
  stroke: #fcd34d;
}

.meta-readers {
  font-size: 13px;
  opacity: 0.65;
}

.btn-add-shelf {
  padding: 10px 24px;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 150ms;
}

.btn-add-shelf:hover {
  background: rgba(255, 255, 255, 0.92);
}

/* ── Two Column Layout ── */
.two-col-layout {
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 20px;
}

/* ── Hot Rankings (Left) ── */
.hot-section {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  padding: 20px;
}

.hot-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.hot-header svg {
  width: 16px;
  height: 16px;
  color: #667eea;
}

.hot-header h3 {
  font-size: 14px;
  font-weight: 600;
  color: #1e1b4b;
  margin: 0;
}

.hot-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hot-item {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 150ms;
}

.hot-item:hover .hot-title {
  color: #667eea;
}

.hot-rank {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  border-radius: 8px;
  flex-shrink: 0;
  background: #f3f4f6;
  color: #9ca3af;
}

.hot-rank.rank-1 {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  box-shadow: 0 1px 3px rgba(102, 126, 234, 0.3);
}

.hot-rank.rank-2 {
  background: #e5e7eb;
  color: #6b7280;
}

.hot-rank.rank-3 {
  background: #fef3c7;
  color: #d97706;
}

.hot-info {
  flex: 1;
  min-width: 0;
}

.hot-title {
  font-size: 13px;
  font-weight: 500;
  color: #1e1b4b;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 150ms;
}

.hot-author {
  font-size: 11px;
  color: #9ca3af;
  margin: 2px 0 0 0;
}

.hot-heat {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.heat-bar {
  width: 40px;
  height: 6px;
  background: #f3f4f6;
  border-radius: 9999px;
  overflow: hidden;
}

.heat-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 9999px;
  transition: width 300ms;
}

.heat-value {
  font-size: 11px;
  color: #9ca3af;
  width: 20px;
  text-align: right;
}

/* ── Similar Recommendations (Right) ── */
.similar-section {
  display: flex;
  flex-direction: column;
}

.similar-header {
  font-size: 14px;
  font-weight: 600;
  color: #1e1b4b;
  margin: 0 0 12px 0;
}

.similar-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.similar-item {
  display: flex;
  gap: 14px;
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 200ms;
}

.similar-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.similar-cover {
  width: 52px;
  height: 68px;
  object-fit: cover;
  border-radius: 10px;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.similar-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.similar-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 4px;
}

.similar-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e1b4b;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 150ms;
}

.similar-item:hover .similar-title {
  color: #667eea;
}

.similar-author {
  font-size: 12px;
  color: #9ca3af;
  margin: 2px 0 0 0;
}

.similar-tag {
  font-size: 11px;
  color: #6b7280;
  background: #f3f4f6;
  padding: 2px 8px;
  border-radius: 9999px;
  flex-shrink: 0;
}

.similar-desc {
  font-size: 12px;
  line-height: 1.55;
  color: #9ca3af;
  margin: 6px 0 0 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.similar-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 8px;
}

.similar-rating {
  display: flex;
  align-items: center;
  gap: 4px;
}

.similar-rating svg {
  width: 12px;
  height: 12px;
  fill: #f59e0b;
  stroke: #f59e0b;
}

.similar-rating span {
  font-size: 12px;
  font-weight: 600;
  color: #1e1b4b;
}

.read-count {
  font-size: 11px;
  color: #9ca3af;
  font-weight: 400;
  margin-left: 4px;
}

.btn-add-sm {
  font-size: 11px;
  font-weight: 600;
  color: #667eea;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 150ms;
}

.btn-add-sm:hover {
  text-decoration: underline;
}

/* ── Loading & Error ── */
.spinner-container {
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

/* ── Responsive ── */
@media (max-width: 900px) {
  .two-col-layout {
    grid-template-columns: 1fr;
  }

  .featured-card {
    padding: 22px;
  }

  .featured-title {
    font-size: 20px;
  }

  .featured-desc {
    max-width: 280px;
  }
}

@media (max-width: 480px) {
  .page-header {
    flex-direction: column;
    gap: 4px;
  }

  .featured-card {
    padding: 18px;
    border-radius: 12px;
  }

  .featured-title {
    font-size: 18px;
  }

  .similar-item {
    flex-direction: column;
  }

  .similar-cover {
    width: 72px;
    height: 96px;
  }
}
</style>
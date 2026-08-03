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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Popular Highlights Section -->
        <div v-if="hotmarks.length > 0" class="section-block">
          <div class="block-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
            </svg>
            <h3>热门划线</h3>
            <span class="block-sub">读者都在划的重点</span>
          </div>
          <div class="hotmarks-list">
            <div v-for="(item, idx) in hotmarks.slice(0, 8)" :key="item.bookmarkId || idx" class="hotmark-item">
              <div class="hotmark-quote">
                <svg viewBox="0 0 24 24" fill="currentColor" class="quote-icon"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
                <p class="hotmark-text">{{ item.markText }}</p>
              </div>
              <div class="hotmark-footer">
                <span class="hotmark-chapter">{{ getChapterName(item.chapterUid) }}</span>
                <div class="hotmark-footer-right">
                  <span class="hotmark-count">{{ item.totalCount }} 人划线</span>
                  <button class="thoughts-toggle" @click.stop="toggleThoughts(item)">
                    {{ expandedHotmarks.has(item.bookmarkId) ? '收起想法' : '查看想法' }}
                    <svg :class="{ rotated: expandedHotmarks.has(item.bookmarkId) }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </button>
                </div>
              </div>
              <div v-if="expandedHotmarks.has(item.bookmarkId)" class="thoughts-panel">
                <div v-if="hotmarkLoading[item.bookmarkId]" class="thoughts-loading">
                  <div class="mini-spinner"></div>
                  <span>加载想法中...</span>
                </div>
                <div v-else-if="hotmarkThoughts[item.bookmarkId]?.length" class="thoughts-list">
                  <div v-for="thought in hotmarkThoughts[item.bookmarkId]" :key="thought.reviewId" class="thought-item">
                    <img :src="thought.review.author?.avatar" :alt="thought.review.author?.name || '用户'" class="thought-avatar" />
                    <div class="thought-body">
                      <div class="thought-author-row">
                        <span class="thought-author-name">{{ thought.review.author?.name || '匿名用户' }}</span>
                        <span class="thought-time">{{ formatThoughtTime(thought.review.createTime) }}</span>
                      </div>
                      <p class="thought-text">{{ thought.review.content }}</p>
                    </div>
                  </div>
                </div>
                <div v-else class="thoughts-empty">暂无其他读者的想法</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Public Reviews Section -->
        <div v-if="publicReviews.length > 0" class="section-block">
          <div class="block-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <h3>读者点评</h3>
            <span class="block-sub">精选书评</span>
          </div>
          <div class="reviews-list">
            <div v-for="(item, idx) in publicReviews.slice(0, 5)" :key="item.review.reviewId || idx" class="review-card">
              <div class="review-author">
                <img :src="item.review.review.author?.avatar" :alt="item.review.review.author?.name || '用户'" class="review-avatar" />
                <div class="review-author-info">
                  <span class="review-name">{{ item.review.review.author?.name || '匿名用户' }}</span>
                  <div class="review-stars">
                    <svg v-for="s in 5" :key="s" viewBox="0 0 24 24" class="star" :class="{ filled: s * 20 <= (item.review.review.star || 0) }">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                </div>
                <span class="review-time">{{ formatReviewTime(item.review.review.createTime) }}</span>
              </div>
              <p class="review-content">{{ item.review.review.content }}</p>
              <div v-if="item.review.review.book" class="review-book-info">
                《{{ item.review.review.book.title }}》
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
import { useRouter } from 'vue-router'
import { wereadApi } from '@/api/weread'
import type { RecommendBook, SimilarBook, BestBookmarkItem, PublicReviewItem, ReadReviewThought } from '@/api/weread'

const router = useRouter()
const recommendations = ref<RecommendBook[]>([])
const hotBooks = ref<RecommendBook[]>([])
const similarBooks = ref<SimilarBook[]>([])
const hotmarks = ref<BestBookmarkItem[]>([])
const hotmarksChapters = ref<{ chapterUid: number; title: string }[]>([])
const publicReviews = ref<PublicReviewItem[]>([])
const expandedHotmarks = ref<Set<string>>(new Set())
const hotmarkThoughts = ref<Record<string, ReadReviewThought[]>>({})
const hotmarkLoading = ref<Record<string, boolean>>({})
const loading = ref(true)
const error = ref('')

const featuredBook = computed(() => recommendations.value[0] || null)

const getChapterName = (chapterUid: number): string => {
  const ch = hotmarksChapters.value.find(c => c.chapterUid === chapterUid)
  return ch?.title || `第 ${chapterUid} 章`
}

const formatReviewTime = (timestamp: number): string => {
  if (!timestamp) return ''
  const d = new Date(timestamp * 1000)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  if (diff < 86400000) return '今天'
  if (diff < 172800000) return '昨天'
  if (diff < 259200000) return '前天'
  return `${d.getMonth() + 1}月${d.getDate()}日`
}

const formatThoughtTime = (timestamp: number): string => {
  if (!timestamp) return ''
  const d = new Date(timestamp * 1000)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  if (diff < 259200000) return `${Math.floor(diff / 86400000)}天前`
  return `${d.getMonth() + 1}月${d.getDate()}日`
}

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

const toggleThoughts = async (bookmark: BestBookmarkItem) => {
  const key = bookmark.bookmarkId
  if (expandedHotmarks.value.has(key)) {
    expandedHotmarks.value.delete(key)
    expandedHotmarks.value = new Set(expandedHotmarks.value)
    return
  }
  expandedHotmarks.value.add(key)
  expandedHotmarks.value = new Set(expandedHotmarks.value)

  if (hotmarkThoughts.value[key]?.length) return

  hotmarkLoading.value[key] = true
  try {
    const firstBook = recommendations.value[0]
    if (!firstBook) return
    const res = await wereadApi.readReviews(firstBook.bookId, bookmark.chapterUid, [
      { range: bookmark.range, count: 10 }
    ])
    if (res.code === 0 && res.data.reviews?.length > 0) {
      hotmarkThoughts.value[key] = res.data.reviews[0].pageReviews || []
    } else {
      hotmarkThoughts.value[key] = []
    }
  } catch {
    hotmarkThoughts.value[key] = []
  } finally {
    hotmarkLoading.value[key] = false
  }
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
      const firstBook = recommendations.value[0]
      try {
        const similarRes = await wereadApi.similar(firstBook.bookId, 6)
        if (similarRes.code === 0) {
          similarBooks.value = similarRes.data.booksimilar?.books || []
        }
      } catch (_) {}

      try {
        const [hotmarksRes, reviewsRes] = await Promise.all([
          wereadApi.hotmarks(firstBook.bookId),
          wereadApi.publicReviews(firstBook.bookId, 0, 0),
        ])
        if (hotmarksRes.code === 0) {
          hotmarks.value = hotmarksRes.data.items || []
          hotmarksChapters.value = hotmarksRes.data.chapters || []
        }
        if (reviewsRes.code === 0) {
          publicReviews.value = reviewsRes.data.reviews?.slice(0, 5) || []
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
  router.push(`/book/${book.bookId}`)
}

const handleSimilarClick = (book: SimilarBook) => {
  const bookId = book.book?.bookInfo?.bookId
  if (bookId) router.push(`/book/${bookId}`)
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

/* ── Section Block ── */
.section-block {
  margin-top: 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  padding: 20px;
}

.block-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.block-header svg {
  width: 16px;
  height: 16px;
  color: #667eea;
}

.block-header h3 {
  font-size: 14px;
  font-weight: 600;
  color: #1e1b4b;
  margin: 0;
}

.block-sub {
  font-size: 12px;
  color: #9ca3af;
  margin-left: 4px;
}

/* ── Hotmarks ── */
.hotmarks-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hotmark-item {
  padding: 14px 16px;
  background: #f9fafb;
  border-radius: 10px;
  border-left: 3px solid #667eea;
}

.hotmark-quote {
  display: flex;
  gap: 10px;
}

.quote-icon {
  width: 16px;
  height: 16px;
  color: #667eea;
  flex-shrink: 0;
  margin-top: 2px;
  opacity: 0.5;
}

.hotmark-text {
  font-size: 14px;
  line-height: 1.6;
  color: #374151;
  margin: 0;
  font-style: italic;
}

.hotmark-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
}

.hotmark-chapter {
  font-size: 12px;
  color: #667eea;
  font-weight: 500;
}

.hotmark-count {
  font-size: 11px;
  color: #9ca3af;
}

/* ── Reviews ── */
.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.review-card {
  padding: 16px;
  background: #f9fafb;
  border-radius: 10px;
}

.review-author {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.review-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.review-author-info {
  flex: 1;
  min-width: 0;
}

.review-name {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #1e1b4b;
}

.review-stars {
  display: flex;
  gap: 2px;
  margin-top: 2px;
}

.review-stars .star {
  width: 10px;
  height: 10px;
  fill: #d1d5db;
  stroke: #d1d5db;
}

.review-stars .star.filled {
  fill: #f59e0b;
  stroke: #f59e0b;
}

.review-time {
  font-size: 11px;
  color: #9ca3af;
  flex-shrink: 0;
}

.review-content {
  font-size: 13px;
  line-height: 1.6;
  color: #6b7280;
  margin: 0 0 8px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.review-book-info {
  font-size: 12px;
  color: #667eea;
  font-weight: 500;
}

/* ── Thoughts Panel ── */
.hotmark-footer-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.thoughts-toggle {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 3px 10px;
  font-size: 11px;
  font-weight: 500;
  color: #667eea;
  background: rgba(102, 126, 234, 0.08);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 150ms;
}

.thoughts-toggle:hover {
  background: rgba(102, 126, 234, 0.18);
}

.thoughts-toggle svg {
  width: 12px;
  height: 12px;
  transition: transform 200ms;
}

.thoughts-toggle svg.rotated {
  transform: rotate(180deg);
}

.thoughts-panel {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
}

.thoughts-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  color: #9ca3af;
  font-size: 12px;
}

.mini-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(102, 126, 234, 0.1);
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.thoughts-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.thought-item {
  display: flex;
  gap: 10px;
}

.thought-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  margin-top: 2px;
}

.thought-body {
  flex: 1;
  min-width: 0;
}

.thought-author-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 3px;
}

.thought-author-name {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
}

.thought-time {
  font-size: 11px;
  color: #9ca3af;
}

.thought-text {
  font-size: 13px;
  line-height: 1.55;
  color: #6b7280;
  margin: 0;
}

.thoughts-empty {
  text-align: center;
  padding: 16px;
  font-size: 12px;
  color: #9ca3af;
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
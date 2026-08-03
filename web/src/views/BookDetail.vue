<template>
  <div class="page-container">
    <div class="page-content">
      <div class="detail-nav">
        <button class="back-btn" @click="goBack">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          返回
        </button>
      </div>

      <div v-if="loading" class="spinner-wrap">
        <div class="spinner"></div>
      </div>

      <div v-else-if="error" class="error-wrap">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12" y2="16"/></svg>
        <p>{{ error }}</p>
      </div>

      <template v-else-if="bookInfo">
        <div class="book-hero">
          <div class="hero-backdrop"></div>
          <div class="hero-content">
            <img :src="bookInfo.cover" :alt="bookInfo.title" class="hero-cover" />
            <div class="hero-info">
              <h1 class="hero-title">{{ bookInfo.title }}</h1>
              <p class="hero-author">{{ bookInfo.author }}</p>
              <div class="hero-rating">
                <svg viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <span class="rating-value">{{ (bookInfo.newRating / 10).toFixed(1) }}</span>
                <span class="rating-count">{{ bookInfo.newRatingCount }} 人评价</span>
              </div>
              <div class="hero-tags">
                <span class="tag">{{ bookInfo.category }}</span>
                <span v-if="bookInfo.publisher" class="tag">{{ bookInfo.publisher }}</span>
                <span v-if="bookInfo.wordCount" class="tag">{{ formatWordCount(bookInfo.wordCount) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="detail-sections">
          <div class="section-card">
            <h3 class="section-title">书籍简介</h3>
            <p class="section-text">{{ bookInfo.intro || '暂无简介' }}</p>
          </div>

          <div v-if="progressInfo" class="section-card">
            <h3 class="section-title">阅读进度</h3>
            <div class="progress-display">
              <div class="progress-ring">
                <svg viewBox="0 0 120 120" class="ring-svg">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#f3f4f6" stroke-width="10"/>
                  <circle cx="60" cy="60" r="50" fill="none" stroke="url(#grad)" stroke-width="10"
                    :stroke-dasharray="`${progressPercent * 3.14} 314`"
                    transform="rotate(-90 60 60)" class="ring-fill"/>
                  <defs><linearGradient id="grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#667eea"/><stop offset="100%" stop-color="#764ba2"/></linearGradient></defs>
                </svg>
                <div class="ring-text">
                  <span class="ring-pct">{{ progressPercent }}%</span>
                  <span class="ring-label">已读</span>
                </div>
              </div>
              <div class="progress-meta">
                <div class="meta-item">
                  <span class="meta-val">{{ formatReadTime(progressInfo.book.recordReadingTime) }}</span>
                  <span class="meta-lbl">累计阅读</span>
                </div>
                <div class="meta-divider"></div>
                <div class="meta-item">
                  <span class="meta-val">{{ progressInfo.book.finishTime ? formatTime(progressInfo.book.finishTime) : '--' }}</span>
                  <span class="meta-lbl">读完时间</span>
                </div>
              </div>
            </div>
          </div>

          <div class="section-card">
            <div class="section-header">
              <h3 class="section-title">章节目录</h3>
              <span class="section-count">{{ chapters.length }} 章</span>
            </div>
            <div v-if="chapters.length === 0" class="empty-chapters">暂无章节信息</div>
            <div v-else class="chapter-list">
              <div
                v-for="ch in chapters"
                :key="ch.chapterUid"
                class="chapter-item"
                :style="{ paddingLeft: (ch.level * 16 + 12) + 'px' }"
              >
                <div class="chapter-dot" :class="{ 'dot-main': ch.level <= 1 }"></div>
                <div class="chapter-info">
                  <span class="chapter-name">{{ ch.title }}</span>
                  <span class="chapter-meta">
                    <span v-if="ch.wordCount">{{ formatWordCount(ch.wordCount) }}</span>
                    <span v-if="ch.paid === 0 && ch.price && ch.price > 0" class="chapter-price">¥{{ (ch.price / 100).toFixed(2) }}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { wereadApi } from '@/api/weread'
import { formatTime } from '@/utils'
import { getCache, setCache } from '@/utils/cache'
import type { ChapterItem } from '@/api/weread'

const route = useRoute()
const router = useRouter()
const bookId = route.params.bookId as string

const bookInfo = ref<any>(null)
const chapters = ref<ChapterItem[]>([])
const progressInfo = ref<any>(null)
const loading = ref(true)
const error = ref('')

const progressPercent = computed(() => progressInfo.value?.book?.progress ?? 0)

const formatWordCount = (count: number): string => {
  if (count >= 10000) return `${(count / 10000).toFixed(1)}万字`
  if (count >= 1000) return `${(count / 1000).toFixed(1)}千字`
  return `${count}字`
}

const formatReadTime = (seconds: number): string => {
  if (!seconds) return '--'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}小时${m}分钟`
  return `${m}分钟`
}

const goBack = () => {
  router.back()
}

onMounted(async () => {
  loading.value = true
  error.value = ''

  const cacheKey = `book_detail_${bookId}`

  try {
    const cached = getCache<{ info: any; chapters: ChapterItem[]; progress: any }>(cacheKey)
    if (cached) {
      bookInfo.value = cached.info
      chapters.value = cached.chapters
      progressInfo.value = cached.progress
      loading.value = false
      return
    }

    const [infoRes, chapterRes, progressRes] = await Promise.all([
      wereadApi.bookInfo(bookId),
      wereadApi.chapterInfo(bookId),
      wereadApi.bookProgress(bookId),
    ])

    if (infoRes.code === 0) bookInfo.value = infoRes.data
    if (chapterRes.code === 0) chapters.value = chapterRes.data.chapters || []
    if (progressRes.code === 0) progressInfo.value = progressRes.data

    setCache(cacheKey, {
      info: bookInfo.value,
      chapters: chapters.value,
      progress: progressInfo.value,
    }, 10 * 60 * 1000)
  } catch (e) {
    error.value = '获取书籍详情失败'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.detail-nav {
  margin-bottom: 16px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border: none;
  background: #fff;
  border-radius: 8px;
  font-size: 13px;
  color: #6b7280;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04);
  transition: all 150ms;
}

.back-btn:hover {
  color: #667eea;
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
}

.back-btn svg {
  width: 16px;
  height: 16px;
}

.book-hero {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 24px;
  color: white;
  overflow: hidden;
  margin-bottom: 20px;
}

.hero-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.1);
}

.hero-content {
  position: relative;
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.hero-cover {
  width: 100px;
  height: 140px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  flex-shrink: 0;
}

.hero-info {
  flex: 1;
  min-width: 0;
}

.hero-title {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 4px;
  line-height: 1.3;
}

.hero-author {
  font-size: 14px;
  opacity: 0.8;
  margin: 0 0 10px;
}

.hero-rating {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
}

.hero-rating svg {
  width: 16px;
  height: 16px;
}

.rating-value {
  font-size: 15px;
  font-weight: 700;
}

.rating-count {
  font-size: 12px;
  opacity: 0.7;
}

.hero-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 9999px;
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255,255,255,0.15);
}

.detail-sections {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #1e1b4b;
  margin: 0 0 10px;
}

.section-header .section-title {
  margin-bottom: 0;
}

.section-count {
  font-size: 12px;
  color: #9ca3af;
}

.section-text {
  font-size: 14px;
  line-height: 1.7;
  color: #6b7280;
  margin: 0;
}

.progress-display {
  display: flex;
  align-items: center;
  gap: 24px;
}

.progress-ring {
  position: relative;
  width: 90px;
  height: 90px;
  flex-shrink: 0;
}

.ring-svg {
  width: 100%;
  height: 100%;
}

.ring-fill {
  transition: stroke-dasharray 500ms;
  stroke-linecap: round;
}

.ring-text {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.ring-pct {
  font-size: 18px;
  font-weight: 700;
  color: #667eea;
  line-height: 1;
}

.ring-label {
  font-size: 11px;
  color: #9ca3af;
}

.progress-meta {
  display: flex;
  align-items: center;
  gap: 20px;
}

.meta-item {
  text-align: center;
}

.meta-val {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #1e1b4b;
  margin-bottom: 2px;
}

.meta-lbl {
  font-size: 11px;
  color: #9ca3af;
}

.meta-divider {
  width: 1px;
  height: 32px;
  background: #e5e7eb;
}

.chapter-list {
  max-height: 400px;
  overflow-y: auto;
}

.chapter-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background 150ms;
  cursor: default;
}

.chapter-item:hover {
  background: #f9fafb;
}

.chapter-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #d1d5db;
  flex-shrink: 0;
}

.chapter-dot.dot-main {
  width: 8px;
  height: 8px;
  background: #667eea;
}

.chapter-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 0;
  gap: 8px;
}

.chapter-name {
  font-size: 13px;
  color: #374151;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chapter-meta {
  font-size: 11px;
  color: #9ca3af;
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.chapter-price {
  color: #f59e0b;
  font-weight: 500;
}

.empty-chapters {
  text-align: center;
  padding: 24px;
  color: #9ca3af;
  font-size: 13px;
}

.spinner-wrap {
  display: flex;
  justify-content: center;
  padding: 64px 20px;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(102,126,234,0.1);
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 64px 20px;
  color: #ef4444;
}

.error-wrap svg {
  width: 36px;
  height: 36px;
  margin-bottom: 12px;
  opacity: 0.4;
}

.error-wrap p {
  margin: 0;
  font-size: 13px;
}

@media (max-width: 480px) {
  .hero-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .hero-tags {
    justify-content: center;
  }

  .hero-rating {
    justify-content: center;
  }

  .hero-cover {
    width: 80px;
    height: 112px;
  }

  .progress-display {
    flex-direction: column;
    align-items: center;
  }
}
</style>
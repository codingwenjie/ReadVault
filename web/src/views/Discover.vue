<template>
  <div class="page-container">
    <NavBar />
    
    <div class="page-content">
      <div class="page-header">
        <h1 class="page-title">发现好书</h1>
        <p class="page-subtitle">探索精选内容，发现你的下一本好书</p>
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
        <div class="section">
          <div class="section-header">
            <div class="section-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              <span>为你推荐</span>
            </div>
            <button class="section-more" @click="loadRecommendations">
              换一批
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="23 4 12 15 1 4"></polyline>
              </svg>
            </button>
          </div>
          
          <div class="recommend-carousel">
            <div
              v-for="book in recommendations"
              :key="book.bookId"
              class="recommend-card"
              @click="handleBookClick(book)"
            >
              <div class="recommend-cover-wrapper">
                <img :src="book.cover" :alt="book.title" class="recommend-cover" />
                <div class="recommend-overlay">
                  <div class="recommend-rating">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    {{ book.newRating ? book.newRating.toFixed(1) : '暂无评分' }}
                  </div>
                </div>
              </div>
              <div class="recommend-info">
                <h3 class="recommend-title">{{ book.title }}</h3>
                <p class="recommend-author">{{ book.author }}</p>
                <p class="recommend-desc">{{ book.intro }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-header">
            <div class="section-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
              <span>热门排行</span>
            </div>
            <span class="section-subtitle">本周最受欢迎的书籍</span>
          </div>
          
          <div class="ranking-list">
            <div
              v-for="(book, index) in hotBooks"
              :key="book.bookId"
              class="ranking-item"
              @click="handleBookClick(book)"
            >
              <div class="ranking-badge" :class="getRankingClass(index)">
                {{ index + 1 }}
              </div>
              <img :src="book.cover" :alt="book.title" class="ranking-cover" />
              <div class="ranking-info">
                <h3 class="ranking-title">{{ book.title }}</h3>
                <p class="ranking-author">{{ book.author }}</p>
                <div class="ranking-meta">
                  <span class="ranking-category">{{ book.category }}</span>
                  <span class="ranking-hot">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 8v4l3 3"></path>
                      <circle cx="12" cy="12" r="10"></circle>
                    </svg>
                    {{ book.readingCount ? `${book.readingCount}人在读` : '热门' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-header">
            <div class="section-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 12l2 2 4-4"></path>
                <circle cx="12" cy="12" r="10"></circle>
              </svg>
              <span>相似推荐</span>
            </div>
            <span class="section-subtitle">基于你的阅读偏好</span>
          </div>
          
          <div class="similar-grid">
            <div
              v-for="similar in similarBooks"
              :key="similar.book.bookInfo.bookId"
              class="similar-card"
              @click="handleBookClick(similar.book.bookInfo)"
            >
              <div class="similar-cover-wrapper">
                <img :src="similar.book.bookInfo.cover" :alt="similar.book.bookInfo.title" class="similar-cover" />
              </div>
              <div class="similar-info">
                <h3 class="similar-title">{{ similar.book.bookInfo.title }}</h3>
                <p class="similar-author">{{ similar.book.bookInfo.author }}</p>
                <div class="similar-tags">
                  <span class="similar-tag">{{ similar.book.bookInfo.category }}</span>
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
import { ref, onMounted } from 'vue'
import { wereadApi } from '@/api/weread'
import NavBar from '@/components/NavBar.vue'
import type { RecommendBook, SimilarBook } from '@/api/weread'

const recommendations = ref<RecommendBook[]>([])
const hotBooks = ref<RecommendBook[]>([])
const similarBooks = ref<SimilarBook[]>([])
const loading = ref(true)
const error = ref('')

const getRankingClass = (index: number): string => {
  if (index === 0) return 'rank-1'
  if (index === 1) return 'rank-2'
  if (index === 2) return 'rank-3'
  return ''
}

const loadRecommendations = async () => {
  try {
    const response = await wereadApi.recommend(6)
    if (response.code === 0) {
      recommendations.value = response.data.books || []
    }
  } catch (e) {
    console.error('加载推荐失败', e)
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
      recommendations.value = recommendRes.data.books || []
      hotBooks.value = recommendRes.data.books?.slice(0, 5) || []
    } else {
      error.value = recommendRes.msg || '获取发现内容失败'
    }

    if (recommendations.value.length > 0) {
      const similarRes = await wereadApi.similar(recommendations.value[0].bookId, 6)
      if (similarRes.code === 0) {
        similarBooks.value = similarRes.data.booksimilar?.books || []
      }
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

onMounted(() => {
  loadDiscover()
})
</script>

<style scoped>
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
  color: var(--color-text-primary);
}

.section-title svg {
  width: 22px;
  height: 22px;
  color: var(--color-primary-start);
}

.section-subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.section-more {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: var(--spacing-xs) var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--color-primary-start);
  background: var(--color-primary-glass);
  border: none;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.section-more:hover {
  background: var(--color-primary-start);
  color: white;
}

.section-more svg {
  width: 14px;
  height: 14px;
}

.recommend-carousel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.recommend-card {
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

.recommend-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.recommend-cover-wrapper {
  position: relative;
  width: 120px;
  flex-shrink: 0;
}

.recommend-cover {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
}

.recommend-overlay {
  position: absolute;
  bottom: -8px;
  left: -8px;
  right: -8px;
}

.recommend-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: var(--color-accent-gold-gradient);
  color: white;
  font-size: var(--font-size-xs);
  font-weight: 600;
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-sm);
}

.recommend-rating svg {
  width: 12px;
  height: 12px;
}

.recommend-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.recommend-title {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-xs) 0;
}

.recommend-author {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0 0 var(--spacing-md) 0;
}

.recommend-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ranking-list {
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border-light);
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.ranking-item:hover {
  background: var(--color-bg-tertiary);
}

.ranking-badge {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-base);
  font-weight: 700;
  color: var(--color-text-muted);
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-md);
  flex-shrink: 0;
}

.ranking-badge.rank-1 {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: white;
}

.ranking-badge.rank-2 {
  background: linear-gradient(135deg, #C0C0C0, #A0A0A0);
  color: white;
}

.ranking-badge.rank-3 {
  background: linear-gradient(135deg, #CD7F32, #B87333);
  color: white;
}

.ranking-cover {
  width: 60px;
  height: 80px;
  object-fit: cover;
  border-radius: var(--radius-sm);
  flex-shrink: 0;
}

.ranking-info {
  flex: 1;
  min-width: 0;
}

.ranking-title {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-xs) 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ranking-author {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0 0 var(--spacing-sm) 0;
}

.ranking-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.ranking-category {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  background: var(--color-bg-tertiary);
  padding: 2px 8px;
  border-radius: var(--radius-full);
}

.ranking-hot {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: var(--font-size-xs);
  color: var(--color-error);
}

.ranking-hot svg {
  width: 12px;
  height: 12px;
}

.similar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: var(--spacing-lg);
}

.similar-card {
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border-light);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.similar-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-lg);
}

.similar-cover-wrapper {
  aspect-ratio: 3/4;
  overflow: hidden;
}

.similar-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.similar-card:hover .similar-cover {
  transform: scale(1.05);
}

.similar-info {
  padding: var(--spacing-md);
}

.similar-title {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-xs) 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.similar-author {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin: 0 0 var(--spacing-sm) 0;
}

.similar-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.similar-tag {
  font-size: var(--font-size-xs);
  color: var(--color-primary-start);
  background: var(--color-primary-glass);
  padding: 2px 8px;
  border-radius: var(--radius-full);
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

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-3xl);
  color: var(--color-error);
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
  .recommend-carousel {
    grid-template-columns: 1fr;
  }
  
  .recommend-card {
    flex-direction: column;
  }
  
  .recommend-cover-wrapper {
    width: 100%;
  }
  
  .recommend-cover {
    width: 100%;
    height: auto;
    aspect-ratio: 3/4;
  }
  
  .ranking-cover {
    width: 48px;
    height: 64px;
  }
  
  .similar-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: var(--spacing-md);
  }
  
  .similar-title {
    font-size: var(--font-size-xs);
  }
}
</style>
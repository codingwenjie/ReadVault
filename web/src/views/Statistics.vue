<template>
  <div class="page-container">
    <NavBar />
    
    <div class="page-content">
      <div class="page-header">
        <h1 class="page-title">阅读统计</h1>
        <p class="page-subtitle">追踪你的阅读习惯和成就</p>
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
        <div class="stats-cards">
          <div class="stat-card">
            <div class="stat-icon-wrap stat-icon-1">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 19V6l12-3v13"></path>
                <circle cx="6" cy="18" r="3"></circle>
                <circle cx="18" cy="16" r="3"></circle>
              </svg>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ stats.totalMinutesRead }}</span>
              <span class="stat-label">阅读分钟</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon-wrap stat-icon-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ stats.totalBooksRead }}</span>
              <span class="stat-label">读完书籍</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon-wrap stat-icon-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ stats.avgMinutesPerDay }}</span>
              <span class="stat-label">日均分钟</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon-wrap stat-icon-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 20V10M8 20V4M3 4h18M4 20h16"></path>
              </svg>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ stats.continuousDays }}</span>
              <span class="stat-label">连续阅读天数</span>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-header">
            <div class="section-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"></path>
                <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              <span>阅读时段热力图</span>
            </div>
            <span class="section-subtitle">最近7天的阅读分布</span>
          </div>
          
          <div class="heatmap-container">
            <div class="heatmap-labels">
              <span>24:00</span>
              <span>12:00</span>
              <span>00:00</span>
            </div>
            <div class="heatmap-grid">
              <div
                v-for="(day, dayIndex) in heatmapData"
                :key="dayIndex"
                class="heatmap-column"
              >
                <div class="day-label">{{ dayLabels[dayIndex] }}</div>
                <div
                  v-for="(hour, hourIndex) in day"
                  :key="hourIndex"
                  class="heatmap-cell"
                  :class="getHeatLevel(hour)"
                  :title="formatHeatmapTitle(dayIndex, hourIndex, hour)"
                ></div>
              </div>
            </div>
            <div class="heatmap-legend">
              <span>少</span>
              <div class="legend-cell level-0"></div>
              <div class="legend-cell level-1"></div>
              <div class="legend-cell level-2"></div>
              <div class="legend-cell level-3"></div>
              <div class="legend-cell level-4"></div>
              <span>多</span>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-header">
            <div class="section-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <span>阅读偏好</span>
            </div>
            <span class="section-subtitle">书籍分类分布</span>
          </div>
          
          <div class="preference-grid">
            <div
              v-for="category in categoryStats"
              :key="category.name"
              class="preference-item"
            >
              <div class="preference-header">
                <span class="preference-name">{{ category.name }}</span>
                <span class="preference-percent">{{ category.percentage }}%</span>
              </div>
              <div class="preference-bar">
                <div
                  class="preference-fill"
                  :style="{ width: category.percentage + '%', background: category.color }"
                ></div>
              </div>
              <span class="preference-count">{{ category.count }} 本书</span>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-header">
            <div class="section-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>作者偏好</span>
            </div>
            <span class="section-subtitle">最爱读的作者</span>
          </div>
          
          <div class="author-list">
            <div
              v-for="(author, index) in authorStats"
              :key="author.name"
              class="author-item"
            >
              <div class="author-rank" :class="getRankingClass(index)">
                {{ index + 1 }}
              </div>
              <div class="author-info">
                <h4>{{ author.name }}</h4>
                <p>{{ author.count }} 本书 · {{ author.totalMinutes }} 分钟</p>
              </div>
              <div class="author-bar">
                <div
                  class="author-fill"
                  :style="{ width: (author.count / maxAuthorCount * 100) + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-header">
            <div class="section-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="23 4 12 14.01l-3-3"></polyline>
                <circle cx="12" cy="12" r="10"></circle>
              </svg>
              <span>本周阅读</span>
            </div>
            <span class="section-subtitle">最近7天的阅读时长</span>
          </div>
          
          <div class="weekly-chart">
            <div
              v-for="(day, index) in weeklyData"
              :key="index"
              class="chart-bar-wrapper"
            >
              <div class="chart-bar" :style="{ height: (day.minutes / maxWeeklyMinutes * 100) + '%' }">
                <span class="bar-tooltip">{{ day.minutes }}分钟</span>
              </div>
              <span class="chart-label">{{ dayLabels[index] }}</span>
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
import NavBar from '@/components/NavBar.vue'

const loading = ref(true)
const error = ref('')

const stats = ref({
  totalMinutesRead: 0,
  totalBooksRead: 0,
  avgMinutesPerDay: 0,
  continuousDays: 0
})

const heatmapData = ref<number[][]>([])
const weeklyData = ref<{ day: string; minutes: number }[]>([])

const dayLabels = ['一', '二', '三', '四', '五', '六', '日']

const categoryStats = ref([
  { name: '小说', count: 12, percentage: 35, color: 'linear-gradient(135deg, #667eea, #764ba2)' },
  { name: '科技', count: 8, percentage: 23, color: 'linear-gradient(135deg, #11998e, #38ef7d)' },
  { name: '经管', count: 6, percentage: 17, color: 'linear-gradient(135deg, #eb3349, #f45c43)' },
  { name: '文学', count: 5, percentage: 15, color: 'linear-gradient(135deg, #f093fb, #f5576c)' },
  { name: '历史', count: 3, percentage: 10, color: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
])

const authorStats = ref([
  { name: '刘慈欣', count: 3, totalMinutes: 1200 },
  { name: '余华', count: 2, totalMinutes: 800 },
  { name: '东野圭吾', count: 2, totalMinutes: 600 },
  { name: '村上春树', count: 2, totalMinutes: 500 },
  { name: '莫言', count: 1, totalMinutes: 400 },
])

const maxAuthorCount = computed(() => Math.max(...authorStats.value.map(a => a.count)))
const maxWeeklyMinutes = computed(() => Math.max(...weeklyData.value.map(d => d.minutes), 1))

const getHeatLevel = (value: number): string => {
  if (value === 0) return 'level-0'
  if (value < 15) return 'level-1'
  if (value < 30) return 'level-2'
  if (value < 60) return 'level-3'
  return 'level-4'
}

const formatHeatmapTitle = (dayIndex: number, hourIndex: number, minutes: number): string => {
  const day = dayLabels[dayIndex]
  const hour = hourIndex.toString().padStart(2, '0')
  return `${day} ${hour}:00 - ${minutes}分钟`
}

const getRankingClass = (index: number): string => {
  if (index === 0) return 'rank-1'
  if (index === 1) return 'rank-2'
  if (index === 2) return 'rank-3'
  return ''
}

const generateMockHeatmapData = (): number[][] => {
  const data: number[][] = []
  for (let i = 0; i < 7; i++) {
    const dayData: number[] = []
    for (let j = 0; j < 24; j++) {
      if ((j >= 8 && j <= 12) || (j >= 19 && j <= 22)) {
        dayData.push(Math.floor(Math.random() * 60) + 10)
      } else if ((j >= 13 && j <= 14) || (j >= 23)) {
        dayData.push(Math.floor(Math.random() * 30))
      } else {
        dayData.push(0)
      }
    }
    data.push(dayData)
  }
  return data
}

const generateMockWeeklyData = (): { day: string; minutes: number }[] => {
  return dayLabels.map(day => ({
    day,
    minutes: Math.floor(Math.random() * 120) + 30
  }))
}

const loadStats = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await wereadApi.readdata('monthly')
    if (response.code === 0) {
      const data = response.data
      stats.value = {
        totalMinutesRead: Math.floor(data.totalReadTime / 60) || 0,
        totalBooksRead: data.readLongest?.length || 0,
        avgMinutesPerDay: Math.floor(data.dayAverageReadTime / 60) || 0,
        continuousDays: data.readDays || 0
      }
    } else {
      error.value = response.msg || '获取统计数据失败'
    }
  } catch (e) {
    error.value = '网络错误，请稍后重试'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadStats()
  heatmapData.value = generateMockHeatmapData()
  weeklyData.value = generateMockWeeklyData()
})
</script>

<style scoped>
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
  margin-top: var(--spacing-xl);
}

.stat-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border-light);
  transition: all var(--transition-normal);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.stat-icon-wrap {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-lg);
  flex-shrink: 0;
}

.stat-icon-1 {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  color: var(--color-primary-start);
}

.stat-icon-2 {
  background: linear-gradient(135deg, rgba(17, 153, 142, 0.1), rgba(56, 239, 125, 0.1));
  color: #11998e;
}

.stat-icon-3 {
  background: linear-gradient(135deg, rgba(234, 51, 73, 0.1), rgba(244, 92, 67, 0.1));
  color: #eb3349;
}

.stat-icon-4 {
  background: linear-gradient(135deg, rgba(79, 172, 254, 0.1), rgba(0, 242, 254, 0.1));
  color: #4facfe;
}

.stat-icon-wrap svg {
  width: 24px;
  height: 24px;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.2;
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin-top: 4px;
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

.heatmap-container {
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border-light);
}

.heatmap-labels {
  display: flex;
  justify-content: space-between;
  padding: 0 var(--spacing-md);
  margin-bottom: var(--spacing-xs);
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.heatmap-grid {
  display: flex;
  gap: 4px;
}

.heatmap-column {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.day-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  margin-bottom: 4px;
  height: 18px;
}

.heatmap-cell {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  margin-bottom: 2px;
  cursor: pointer;
  transition: transform var(--transition-fast);
}

.heatmap-cell:hover {
  transform: scale(1.5);
  z-index: 10;
}

.heatmap-cell.level-0 {
  background: var(--color-bg-tertiary);
}

.heatmap-cell.level-1 {
  background: rgba(102, 126, 234, 0.25);
}

.heatmap-cell.level-2 {
  background: rgba(102, 126, 234, 0.5);
}

.heatmap-cell.level-3 {
  background: rgba(102, 126, 234, 0.75);
}

.heatmap-cell.level-4 {
  background: var(--color-primary-start);
}

.heatmap-legend {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  margin-top: var(--spacing-md);
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.legend-cell {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.preference-grid {
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border-light);
}

.preference-item {
  margin-bottom: var(--spacing-lg);
}

.preference-item:last-child {
  margin-bottom: 0;
}

.preference-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
}

.preference-name {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-primary);
}

.preference-percent {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-primary-start);
}

.preference-bar {
  height: 8px;
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.preference-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width var(--transition-normal);
}

.preference-count {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  margin-top: 4px;
}

.author-list {
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border-light);
}

.author-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  transition: background var(--transition-fast);
}

.author-item:hover {
  background: var(--color-bg-tertiary);
}

.author-rank {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-sm);
  font-weight: 700;
  color: var(--color-text-muted);
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-md);
  flex-shrink: 0;
}

.author-rank.rank-1 {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: white;
}

.author-rank.rank-2 {
  background: linear-gradient(135deg, #C0C0C0, #A0A0A0);
  color: white;
}

.author-rank.rank-3 {
  background: linear-gradient(135deg, #CD7F32, #B87333);
  color: white;
}

.author-info {
  flex: 1;
  min-width: 0;
}

.author-info h4 {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 2px 0;
}

.author-info p {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  margin: 0;
}

.author-bar {
  width: 100px;
  height: 6px;
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.author-fill {
  height: 100%;
  background: var(--color-primary-gradient);
  border-radius: var(--radius-full);
  transition: width var(--transition-normal);
}

.weekly-chart {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl) var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border-light);
  height: 200px;
}

.chart-bar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  height: 100%;
  justify-content: flex-end;
}

.chart-bar {
  width: 32px;
  background: var(--color-primary-gradient);
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  position: relative;
  transition: height var(--transition-normal);
  cursor: pointer;
}

.chart-bar:hover {
  opacity: 0.8;
}

.chart-bar:hover .bar-tooltip {
  opacity: 1;
  transform: translateX(-50%) translateY(-8px);
}

.bar-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-text-primary);
  color: white;
  font-size: var(--font-size-xs);
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  white-space: nowrap;
  opacity: 0;
  transition: all var(--transition-fast);
  margin-bottom: 8px;
}

.bar-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-top-color: var(--color-text-primary);
}

.chart-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  margin-top: var(--spacing-sm);
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
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stat-card {
    flex-direction: column;
    text-align: center;
  }
  
  .stat-value {
    font-size: var(--font-size-xl);
  }
  
  .heatmap-cell {
    width: 10px;
    height: 10px;
  }
  
  .author-bar {
    display: none;
  }
  
  .chart-bar {
    width: 20px;
  }
}
</style>
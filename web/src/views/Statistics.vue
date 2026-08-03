<template>
  <div class="page-container">
    <div class="page-content">
      <!-- Header -->
      <div class="page-header">
        <h1 class="page-title">阅读统计</h1>
        <p class="page-subtitle">{{ periodLabel }} · 数据概览</p>
      </div>

      <div class="period-selector">
        <div class="period-tabs">
          <button
            v-for="tab in periodTabs"
            :key="tab.mode"
            class="period-tab"
            :class="{ active: selectedMode === tab.mode && !selectedMonth }"
            @click="selectPeriod(tab.mode)"
          >
            {{ tab.label }}
          </button>
        </div>
        <div class="month-picker" v-if="showMonthPicker">
          <button class="month-btn" @click="shiftMonth(-1)" :disabled="isFirstMonth">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <span class="month-label">{{ monthLabel }}</span>
          <button class="month-btn" @click="shiftMonth(1)" :disabled="isCurrentMonth">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      </div>

      <div v-if="loading" class="spinner-wrap">
        <div class="spinner"></div>
      </div>

      <div v-else-if="error" class="error-wrap">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12" y2="16"></line>
        </svg>
        <p>{{ error }}</p>
      </div>

      <div v-else class="space-y-5">
        <!-- Stat Cards -->
        <div class="stat-grid">
          <div class="stat-card">
            <div class="stat-icon grad-purple">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </div>
            <div class="stat-info">
              <div class="stat-val-row">
                <span class="stat-value">{{ stats.totalBooks }}</span>
                <span class="stat-unit">本</span>
              </div>
              <p class="stat-label">累计书籍</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon grad-rose">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <div class="stat-info">
              <div class="stat-val-row">
                <span class="stat-value">{{ formattedDuration }}</span>
              </div>
              <p class="stat-label">{{ durationLabel }}</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon grad-emerald">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
              </svg>
            </div>
            <div class="stat-info">
              <div class="stat-val-row">
                <span class="stat-value">{{ stats.totalNotes }}</span>
                <span class="stat-unit">条</span>
              </div>
              <p class="stat-label">总笔记数</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon grad-amber">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
              </svg>
            </div>
            <div class="stat-info">
              <div class="stat-val-row">
                <span class="stat-value">{{ stats.continuousDays }}</span>
                <span class="stat-unit">天</span>
              </div>
              <p class="stat-label">连续阅读</p>
            </div>
          </div>
        </div>

        <!-- Charts Row -->
        <div class="charts-row">
          <!-- Weekly Bar Chart -->
          <div class="chart-card chart-wide">
            <h3 class="chart-title">本周每日阅读时长</h3>
            <p class="chart-subtitle">单位：分钟</p>
            <div class="bar-chart">
              <div
                v-for="(d, i) in weeklyData"
                :key="i"
                class="bar-col"
              >
                <div class="bar-wrap">
                  <div
                    class="bar-fill"
                    :style="{ height: barHeight(d.minutes) + '%' }"
                  >
                    <span class="bar-tip">{{ d.minutes }} 分钟</span>
                  </div>
                </div>
                <span class="bar-day">{{ d.day }}</span>
              </div>
            </div>
          </div>

          <!-- Category Donut / List -->
          <div class="chart-card chart-narrow">
            <h3 class="chart-title">阅读分类</h3>
            <p class="chart-subtitle">书籍类型分布</p>
            <div class="donut-wrap">
              <svg viewBox="0 0 120 120" class="donut-svg">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#f3f4f6" stroke-width="18" />
                <template v-for="(seg) in donutSegments" :key="seg.color">
                  <circle
                    cx="60" cy="60" r="50"
                    fill="none"
                    :stroke="seg.color"
                    stroke-width="18"
                    :stroke-dasharray="`${seg.len} ${314 - seg.len}`"
                    :stroke-dashoffset="-seg.offset"
                    transform="rotate(-90 60 60)"
                    class="donut-seg"
                  />
                </template>
              </svg>
            </div>
            <div class="cat-list">
              <div v-for="cat in categoryData" :key="cat.name" class="cat-item">
                <div class="cat-left">
                  <span class="cat-dot" :style="{ background: cat.color }"></span>
                  <span class="cat-name">{{ cat.name }}</span>
                </div>
                <div class="cat-right">
                  <div class="cat-bar-track">
                    <div class="cat-bar-fill" :style="{ width: cat.value + '%', background: cat.color }"></div>
                  </div>
                  <span class="cat-pct">{{ cat.value }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Heatmap -->
        <div class="heatmap-card">
          <div class="heatmap-head">
            <div>
              <h3 class="heatmap-title">阅读热力图</h3>
              <p class="heatmap-subtitle">过去 {{ heatmapWeeks.length }} 周每日阅读记录</p>
            </div>
            <div class="legend-row">
              <span class="legend-text">少</span>
              <div v-for="(l, i) in legendLevels" :key="i" :class="['legend-dot', l]"></div>
              <span class="legend-text">多</span>
            </div>
          </div>
          <div class="heatmap-scroll">
            <div class="heatmap-grid">
              <div v-for="(week, wi) in heatmapWeeks" :key="wi" class="hm-week">
                <div
                  v-for="(day, di) in week.days"
                  :key="di"
                  :class="['hm-cell', heatClass(day)]"
                  :title="heatTitle(day)"
                ></div>
              </div>
            </div>
          </div>
          <div class="heatmap-foot">
            <div v-for="item in footStats" :key="item.label" class="foot-stat">
              <p class="foot-val">{{ item.value }}</p>
              <p class="foot-label">{{ item.label }}</p>
            </div>
          </div>
        </div>

        <!-- Preference Row -->
        <div class="charts-row">
          <!-- Author Ranking -->
          <div class="chart-card chart-wide">
            <h3 class="chart-title">偏好作者</h3>
            <p class="chart-subtitle">阅读时长排行</p>
            <div class="author-list">
              <div v-for="(author, i) in authorData" :key="author.name" class="author-item">
                <span class="author-rank">{{ i + 1 }}</span>
                <div class="author-info">
                  <span class="author-name">{{ author.name }}</span>
                  <span class="author-books">{{ author.count }} 本</span>
                </div>
                <span class="author-time">{{ author.readTime }}</span>
              </div>
              <div v-if="authorData.length === 0" class="empty-tip">暂无足够数据</div>
            </div>
          </div>

          <!-- Reading Time Distribution -->
          <div class="chart-card chart-narrow">
            <h3 class="chart-title">阅读时段</h3>
            <p class="chart-subtitle">{{ preferTimeWord || '24 小时分布' }}</p>
            <div class="time-chart">
              <div v-for="(item, i) in timeData" :key="i" class="time-col">
                <div class="time-bar-wrap">
                  <div class="time-bar-fill" :style="{ height: item.pct + '%' }"></div>
                </div>
                <span class="time-label">{{ item.label }}</span>
              </div>
            </div>
            <div v-if="timeData.length === 0" class="empty-tip" style="margin-top: -8px;">暂无足够数据</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { wereadApi } from '@/api/weread'
import type { ReadDataResponse } from '@/api/weread'
import { formatDuration } from '@/utils'

const loading = ref(true)
const error = ref('')

type PeriodMode = 'weekly' | 'monthly' | 'annually' | 'overall'

const selectedMode = ref<PeriodMode>('monthly')
const selectedMonth = ref<{ year: number; month: number } | null>(null)

const periodTabs = [
  { mode: 'weekly' as const, label: '本周' },
  { mode: 'monthly' as const, label: '本月' },
  { mode: 'annually' as const, label: '本年' },
  { mode: 'overall' as const, label: '总计' },
]

const now = new Date()
const currentYear = now.getFullYear()
const currentMonthNum = now.getMonth() + 1

const showMonthPicker = computed(() => selectedMonth.value !== null)

const monthLabel = computed(() => {
  if (!selectedMonth.value) return ''
  return `${selectedMonth.value.year}年${selectedMonth.value.month}月`
})

const isCurrentMonth = computed(() => {
  if (!selectedMonth.value) return false
  return selectedMonth.value.year === currentYear && selectedMonth.value.month === currentMonthNum
})

const isFirstMonth = computed(() => {
  if (!selectedMonth.value) return false
  return selectedMonth.value.month === 1
})

const periodLabel = computed(() => {
  if (selectedMonth.value) return `${selectedMonth.value.year}年${selectedMonth.value.month}月`
  const tab = periodTabs.find(t => t.mode === selectedMode.value)
  return tab?.label || ''
})

const durationLabel = computed(() => {
  if (selectedMode.value === 'weekly') return '本周时长'
  if (selectedMode.value === 'annually') return '本年时长'
  if (selectedMode.value === 'overall') return '总阅读时长'
  if (selectedMonth.value) return `${selectedMonth.value.month}月时长`
  return '本月时长'
})

const totalReadSeconds = ref(0)

const formattedDuration = computed(() => {
  return formatDuration(totalReadSeconds.value)
})

const formattedAvgDuration = computed(() => {
  const seconds = stats.value.avgMinutes * 60
  return formatDuration(seconds)
})

interface StatCard {
  totalBooks: number
  monthHours: number
  totalNotes: number
  continuousDays: number
  avgMinutes: number
}

const stats = ref<StatCard>({
  totalBooks: 0,
  monthHours: 0,
  totalNotes: 0,
  continuousDays: 0,
  avgMinutes: 0,
})

const selectPeriod = (mode: PeriodMode) => {
  selectedMode.value = mode
  selectedMonth.value = null
  loadStats()
}

const shiftMonth = (delta: number) => {
  if (!selectedMonth.value) return
  const { year, month } = selectedMonth.value
  let newMonth = month + delta
  let newYear = year
  if (newMonth > 12) { newMonth = 1; newYear++ }
  if (newMonth < 1) { newMonth = 12; newYear-- }
  selectedMonth.value = { year: newYear, month: newMonth }
  loadStats()
}

const weeklyData = ref<{ day: string; minutes: number }[]>([])

const maxWeeklyMin = computed(() => Math.max(...weeklyData.value.map(d => d.minutes), 1))

const barHeight = (min: number): number => {
  if (maxWeeklyMin.value === 0) return 0
  return Math.round((min / maxWeeklyMin.value) * 100)
}

interface CategoryItem {
  name: string
  value: number
  color: string
}

const categoryColors = ['#667eea', '#11998e', '#eb3349', '#f093fb', '#4facfe', '#8b5cf6', '#06b6d4', '#84cc16']
const categoryData = ref<CategoryItem[]>([])

interface AuthorItem {
  name: string
  count: number
  readTime: string
}

interface TimeSlot {
  label: string
  minutes: number
  pct: number
}

const authorData = ref<AuthorItem[]>([])
const timeData = ref<TimeSlot[]>([])
const preferTimeWord = ref('')

interface HeatDay {
  date: Date
  minutes: number
}

interface HeatWeek {
  days: HeatDay[]
}

const heatmapWeeks = ref<HeatWeek[]>([])
const totalReadDays = ref(0)
const longestStreak = ref(0)

const footStats = computed(() => [
  { label: '总阅读天数', value: `${totalReadDays.value} 天` },
  { label: '最长连续', value: `${longestStreak.value} 天` },
  { label: '日均时长', value: formattedAvgDuration.value },
])

const donutSegments = computed(() => {
  const circumference = 314
  let offset = 0
  return categoryData.value.map(cat => {
    const len = Math.round((cat.value / 100) * circumference)
    const seg = { color: cat.color, len, offset }
    offset += len
    return seg
  })
})

const legendLevels = ['lv0', 'lv1', 'lv2', 'lv3', 'lv4']

const heatClass = (day: HeatDay): string => {
  if (day.minutes === 0) return 'lv0'
  if (day.minutes < 20) return 'lv1'
  if (day.minutes < 45) return 'lv2'
  if (day.minutes < 70) return 'lv3'
  return 'lv4'
}

const heatTitle = (day: HeatDay): string => {
  const d = day.date
  const m = d.getMonth() + 1
  const dd = d.getDate()
  return `${m}/${dd} · ${day.minutes} 分钟`
}

const parseReadStatCount = (counts: string | undefined): number => {
  if (!counts) return 0
  const match = counts.match(/(\d+)/)
  return match ? parseInt(match[1], 10) : 0
}

const generateHeatmapFromDailyData = (dailyReadTimes?: Record<string, number>, readTimes?: Record<string, number>): void => {
  const weeks: HeatWeek[] = []
  const now = new Date()
  let realReadDays = 0
  const timeData = dailyReadTimes || readTimes

  for (let w = 15; w >= 0; w--) {
    const days: HeatDay[] = []
    for (let d = 0; d < 7; d++) {
      const date = new Date(now)
      date.setDate(date.getDate() - (w * 7 + (6 - d)))
      date.setHours(0, 0, 0, 0)
      const ts = Math.floor(date.getTime() / 1000)
      let minutes = 0

      if (timeData && timeData[ts]) {
        minutes = Math.round(timeData[ts] / 60)
        if (minutes > 0) realReadDays++
      }

      days.push({ date, minutes })
    }
    weeks.push({ days })
  }

  heatmapWeeks.value = weeks
  totalReadDays.value = realReadDays

  let maxStreak = 0
  let curStreak = 0
  weeks.forEach(w => w.days.forEach(d => {
    if (d.minutes > 0) { curStreak++; maxStreak = Math.max(maxStreak, curStreak) }
    else { curStreak = 0 }
  }))
  longestStreak.value = maxStreak || 0
}

const generateWeeklyFromReadTimes = (readTimes: Record<string, number>): void => {
  const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const sortedEntries = Object.entries(readTimes).sort(([a], [b]) => parseInt(a) - parseInt(b))

  weeklyData.value = sortedEntries.map(([ts, seconds]) => {
    const date = new Date(parseInt(ts) * 1000)
    return {
      day: dayNames[date.getDay()],
      minutes: Math.round(seconds / 60),
    }
  })
}

const loadPeriodData = async (mode: PeriodMode, baseTime?: number): Promise<ReadDataResponse | null> => {
  try {
    const response = await wereadApi.readdata(mode, baseTime)
    if (response.code === 0) {
      return response.data
    }
  } catch (e) {
    console.error('获取统计数据失败', e)
  }
  return null
}

const getBaseTime = (): number | undefined => {
  if (!selectedMonth.value) return undefined
  const { year, month } = selectedMonth.value
  return Math.floor(new Date(year, month - 1, 1).getTime() / 1000)
}

const processStats = (data: ReadDataResponse): void => {
  const readBooksStat = data.readStat?.find(s => s.stat === '读过')
  const finishBooksStat = data.readStat?.find(s => s.stat === '读完')
  const notesStat = data.readStat?.find(s => s.stat === '笔记')

  totalReadSeconds.value = data.totalReadTime || 0

  stats.value = {
    totalBooks: parseReadStatCount(readBooksStat?.counts) || parseReadStatCount(finishBooksStat?.counts) || data.readLongest?.length || 0,
    monthHours: Math.round(data.totalReadTime / 60) || 0,
    totalNotes: parseReadStatCount(notesStat?.counts) || 0,
    continuousDays: data.readDays || 0,
    avgMinutes: Math.round(data.dayAverageReadTime / 60) || 0,
  }

  if (data.preferCategory && data.preferCategory.length > 0) {
    const totalReadingTime = data.preferCategory.reduce((sum, c) => sum + (c.readingTime || 0), 0)
    categoryData.value = data.preferCategory.slice(0, 8).map((cat, idx) => ({
      name: cat.categoryTitle || cat.parentCategoryTitle || '其他',
      value: totalReadingTime > 0 ? Math.round((cat.readingTime || 0) / totalReadingTime * 100) : 0,
      color: categoryColors[idx % categoryColors.length],
    }))
  }

  if (data.preferAuthor && data.preferAuthor.length > 0) {
    authorData.value = data.preferAuthor.map(a => ({
      name: a.name,
      count: a.count,
      readTime: a.readTime,
    }))
  }

  if (data.preferTime && data.preferTime.length === 24) {
    const maxVal = Math.max(...data.preferTime, 1)
    const reordered: number[] = []
    for (let h = 0; h < 24; h++) {
      reordered[h] = data.preferTime[(h + 18) % 24]
    }
    timeData.value = reordered.map((seconds, h) => ({
      label: `${h}时`,
      minutes: Math.round(seconds / 60),
      pct: maxVal > 0 ? Math.round(seconds / maxVal * 100) : 0,
    }))
  }

  if (data.preferTimeWord) {
    preferTimeWord.value = data.preferTimeWord
  }

  generateHeatmapFromDailyData(data.dailyReadTimes, data.readTimes)
}

const loadStats = async () => {
  loading.value = true
  error.value = ''

  try {
    const baseTime = getBaseTime()
    const mode = selectedMode.value
    const [mainData, weeklyRes] = await Promise.all([
      loadPeriodData(mode, baseTime),
      mode === 'weekly' ? null : loadPeriodData('weekly'),
    ])

    if (mainData) {
      processStats(mainData)
    } else {
      error.value = '无法获取阅读统计数据'
    }

    if (mode === 'weekly' && mainData?.readTimes) {
      generateWeeklyFromReadTimes(mainData.readTimes)
    } else if (weeklyRes && weeklyRes.readTimes) {
      generateWeeklyFromReadTimes(weeklyRes.readTimes)
    } else {
      const labels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      weeklyData.value = labels.map(day => ({ day, minutes: 0 }))
    }
  } catch (e) {
    console.error(e)
    error.value = '加载统计数据失败'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadStats()
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
  align-items: baseline;
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
  font-size: 13px;
  color: #9ca3af;
  margin: 0;
}

.period-selector {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.period-tabs {
  display: flex;
  gap: 4px;
  background: rgba(243, 244, 246, 0.8);
  padding: 3px;
  border-radius: 10px;
}

.period-tab {
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 150ms;
}

.period-tab:hover {
  color: #374151;
}

.period-tab.active {
  color: #fff;
  background: linear-gradient(135deg, #667eea, #764ba2);
  box-shadow: 0 1px 3px rgba(102, 126, 234, 0.3);
}

.month-picker {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(243, 244, 246, 0.8);
  padding: 4px 8px;
  border-radius: 10px;
}

.month-btn {
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: #6b7280;
  transition: all 150ms;
}

.month-btn:hover:not(:disabled) {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.month-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.month-btn svg {
  width: 14px;
  height: 14px;
}

.month-label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  min-width: 80px;
  text-align: center;
}

.space-y-5 > * + * {
  margin-top: 20px;
}

/* ── Stat Cards ── */
.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.stat-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.stat-icon svg {
  width: 20px;
  height: 20px;
  color: white;
}

.grad-purple {
  background: linear-gradient(135deg, #667eea, #764ba2);
}
.grad-rose {
  background: linear-gradient(135deg, #fb7185, #db2777);
}
.grad-emerald {
  background: linear-gradient(135deg, #34d399, #0d9488);
}
.grad-amber {
  background: linear-gradient(135deg, #fbbf24, #f97316);
}

.stat-info {
  flex: 1;
  min-width: 0;
}

.stat-val-row {
  display: flex;
  align-items: baseline;
  gap: 3px;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #1e1b4b;
  line-height: 1.2;
}

.stat-unit {
  font-size: 11px;
  color: #9ca3af;
}

.stat-label {
  font-size: 12px;
  color: #9ca3af;
  margin: 2px 0 0 0;
}

/* ── Charts Row ── */
.charts-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}

.chart-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.chart-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e1b4b;
  margin: 0 0 2px 0;
}

.chart-subtitle {
  font-size: 12px;
  color: #9ca3af;
  margin: 0 0 20px 0;
}

/* Bar Chart */
.bar-chart {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 180px;
  padding-top: 8px;
}

.bar-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  height: 100%;
  justify-content: flex-end;
}

.bar-wrap {
  width: 28px;
  height: 100%;
  display: flex;
  align-items: flex-end;
  position: relative;
}

.bar-fill {
  width: 100%;
  background: linear-gradient(180deg, #667eea, #764ba2);
  border-radius: 8px 8px 0 0;
  min-height: 4px;
  transition: height 300ms ease;
  cursor: pointer;
  position: relative;
}

.bar-fill:hover {
  opacity: 0.88;
}

.bar-fill:hover .bar-tip {
  opacity: 1;
  transform: translateX(-50%) translateY(-6px);
}

.bar-tip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #1e1b4b;
  color: white;
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 6px;
  white-space: nowrap;
  opacity: 0;
  transition: all 150ms;
  pointer-events: none;
  margin-bottom: 6px;
}

.bar-day {
  font-size: 11px;
  color: #9ca3af;
  margin-top: 8px;
}

/* Category Donut */
.donut-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
}

.donut-svg {
  width: 120px;
  height: 120px;
}

.donut-seg {
  transition: opacity 200ms;
}
.donut-seg:hover {
  opacity: 0.75;
}

.cat-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cat-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.cat-left {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.cat-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.cat-name {
  font-size: 12px;
  color: #6b7280;
}

.cat-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  justify-content: flex-end;
}

.cat-bar-track {
  width: 64px;
  height: 6px;
  background: #f3f4f6;
  border-radius: 9999px;
  overflow: hidden;
}

.cat-bar-fill {
  height: 100%;
  border-radius: 9999px;
  transition: width 400ms ease;
}

.cat-pct {
  font-size: 12px;
  font-weight: 600;
  color: #1e1b4b;
  width: 26px;
  text-align: right;
}

/* ── Heatmap Card ── */
.heatmap-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.heatmap-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
}

.heatmap-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e1b4b;
  margin: 0 0 2px 0;
}

.heatmap-subtitle {
  font-size: 12px;
  color: #9ca3af;
  margin: 0;
}

.legend-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.legend-text {
  font-size: 11px;
  color: #9ca3af;
}

.legend-dot {
  width: 14px;
  height: 14px;
  border-radius: 3px;
  flex-shrink: 0;
}

.lv0 { background: #f3f4f6; }
.lv1 { background: rgba(102, 126, 234, 0.2); }
.lv2 { background: rgba(102, 126, 234, 0.4); }
.lv3 { background: rgba(102, 126, 234, 0.65); }
.lv4 { background: #667eea; }

.heatmap-scroll {
  overflow-x: auto;
  margin-bottom: 16px;
}

.heatmap-grid {
  display: flex;
  gap: 4px;
  min-width: max-content;
}

.hm-week {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.hm-cell {
  width: 14px;
  height: 14px;
  border-radius: 3px;
  cursor: default;
  transition: all 150ms;
}

.hm-cell:hover {
  ring: 1px solid rgba(102, 126, 234, 0.4);
  box-shadow: 0 0 0 1px rgba(102, 126, 234, 0.35);
}

.heatmap-foot {
  display: flex;
  gap: 48px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.foot-stat p {
  margin: 0;
}

.foot-val {
  font-size: 16px;
  font-weight: 700;
  color: #1e1b4b;
}

.foot-label {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 2px !important;
}

/* ── Spinner / Error ── */
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

.error-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 64px 20px;
  text-align: center;
}

.error-wrap svg {
  width: 40px;
  height: 40px;
  color: #d1d5db;
  margin-bottom: 12px;
}

.error-wrap p {
  font-size: 14px;
  color: #9ca3af;
  margin: 0;
}

/* ── Author Ranking ── */
.author-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.author-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
}

.author-item:last-child {
  border-bottom: none;
}

.author-rank {
  width: 20px;
  font-size: 12px;
  font-weight: 700;
  color: #9ca3af;
  text-align: center;
  flex-shrink: 0;
}

.author-item:nth-child(1) .author-rank { color: #f59e0b; }
.author-item:nth-child(2) .author-rank { color: #9ca3af; }
.author-item:nth-child(3) .author-rank { color: #d97706; }

.author-info {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.author-name {
  font-size: 13px;
  font-weight: 600;
  color: #1e1b4b;
}

.author-books {
  font-size: 11px;
  color: #9ca3af;
}

.author-time {
  font-size: 12px;
  font-weight: 600;
  color: #667eea;
  flex-shrink: 0;
}

/* ── Time Distribution ── */
.time-chart {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 120px;
  padding-top: 4px;
}

.time-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  height: 100%;
  justify-content: flex-end;
}

.time-bar-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
}

.time-bar-fill {
  width: 100%;
  background: linear-gradient(180deg, #667eea, #764ba2);
  border-radius: 3px 3px 0 0;
  min-height: 2px;
  transition: height 300ms ease;
}

.time-label {
  font-size: 8px;
  color: #9ca3af;
  margin-top: 4px;
  writing-mode: vertical-lr;
  text-orientation: mixed;
  height: 14px;
  line-height: 1;
}

.empty-tip {
  text-align: center;
  padding: 20px;
  color: #9ca3af;
  font-size: 13px;
}

/* ── Responsive ── */
@media (max-width: 900px) {
  .charts-row {
    grid-template-columns: 1fr;
  }

  .stat-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .page-header {
    flex-direction: column;
    gap: 4px;
  }

  .stat-grid {
    grid-template-columns: 1fr;
  }

  .heatmap-foot {
    flex-wrap: wrap;
    gap: 24px;
  }

  .bar-chart {
    height: 140px;
  }
}
</style>
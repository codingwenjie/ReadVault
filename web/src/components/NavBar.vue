<template>
  <aside class="sidebar">
    <!-- Brand -->
    <div class="sidebar-brand" @click="$router.push('/shelf')">
      <div class="brand-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
      </div>
      <span class="brand-text">ReadVault</span>
    </div>

    <!-- Navigation -->
    <nav class="sidebar-nav">
      <button
        v-for="item in navItems"
        :key="item.path"
        class="nav-item"
        :class="{ active: currentPath === item.path }"
        @click="$router.push(item.path)"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="item.icon"></svg>
        <span class="nav-label">{{ item.label }}</span>
        <div v-if="currentPath === item.path" class="nav-dot" />
      </button>
    </nav>

    <!-- Footer -->
    <div class="sidebar-footer">
      <div class="sidebar-divider" />
      <div class="user-section">
        <div class="user-avatar">{{ userInitial }}</div>
        <div class="user-info">
          <p class="user-name">{{ userName }}</p>
          <p class="user-stats">已读 {{ finishedBookCount }} 本书</p>
        </div>
      </div>
      <button class="logout-btn" @click="handleLogout">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
        退出登录
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { wereadApi } from '@/api/weread'

const router = useRouter()

const currentPath = computed(() => router.currentRoute.value.path)

const userName = ref('微信读书用户')
const userInitial = ref('微')
const finishedBookCount = ref(0)

onMounted(async () => {
  try {
    const res = await wereadApi.shelf()
    if (res.code === 0 && res.data.books) {
      const books = res.data.books
      finishedBookCount.value = books.filter(b => b.finishReading === 1).length
    }
  } catch (_) {
    // 静默处理
  }
})

const navItems = [
  { path: '/shelf', label: '我的书架', icon: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>' },
  { path: '/notes', label: '读书笔记', icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>' },
  { path: '/discover', label: '发现好书', icon: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>' },
  { path: '/search', label: '搜索书籍', icon: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>' },
  { path: '/statistics', label: '阅读统计', icon: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>' },
]

const handleLogout = () => {
  wereadApi.clearApiKey()
  router.push('/auth')
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 240px;
  z-index: var(--z-fixed);
  background: var(--sidebar);
  border-right: 1px solid var(--sidebar-border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 24px 20px 20px;
  cursor: pointer;
}

.brand-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: var(--radius-lg);
  color: white;
  flex-shrink: 0;
  box-shadow: var(--shadow-sm);
}

.brand-icon svg {
  width: 16px;
  height: 16px;
}

.brand-text {
  font-size: 15px;
  font-weight: 600;
  color: var(--sidebar-foreground);
  letter-spacing: -0.02em;
}

.sidebar-nav {
  flex: 1;
  padding: 0 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border: none;
  background: transparent;
  color: var(--sidebar-foreground);
  font-size: 13px;
  font-weight: 500;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.15s;
  text-align: left;
  position: relative;
}

.nav-item svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  opacity: 0.7;
  transition: all 0.15s;
}

.nav-label {
  flex: 1;
}

.nav-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #667eea;
  flex-shrink: 0;
}

.nav-item:hover {
  background: var(--sidebar-accent);
  color: var(--sidebar-foreground);
}

.nav-item:hover svg {
  opacity: 1;
}

.nav-item.active {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.04));
  color: #667eea;
}

.nav-item.active svg {
  opacity: 1;
  color: #667eea;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid var(--sidebar-border);
}

.sidebar-divider {
  display: none;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--sidebar-foreground);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-stats {
  font-size: 11px;
  color: var(--muted-foreground);
  margin: 2px 0 0;
}

.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: none;
  background: transparent;
  color: var(--muted-foreground);
  font-size: 11px;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.15s;
  text-align: left;
}

.logout-btn:hover {
  background: var(--sidebar-accent);
  color: var(--sidebar-foreground);
}

.logout-btn svg {
  width: 14px;
  height: 14px;
}

@media (max-width: 768px) {
  .sidebar {
    width: 200px;
    transform: translateX(-100%);
  }
  
  .sidebar.open {
    transform: translateX(0);
  }
}
</style>
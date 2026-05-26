<template>
  <div class="app-layout">
    <NavBar v-if="isLoggedIn" />
    <div class="app-main" :class="{ 'no-sidebar': !isLoggedIn }">
      <header class="mobile-header" v-if="isLoggedIn">
        <div class="mobile-brand">
          <div class="mobile-brand-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
          </div>
          <span class="mobile-brand-text">ReadVault</span>
        </div>
        <div class="mobile-actions">
          <button class="mobile-notif-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </button>
          <div class="mobile-avatar">陈</div>
        </div>
      </header>
      <main class="main-content" :class="{ 'auth-page': !isLoggedIn }">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from '@/components/NavBar.vue'

const route = useRoute()

const isLoggedIn = computed(() => route.path !== '/auth')
</script>

<style>
/* 安全兜底：确保不会出现浏览器级滚动条 */
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: clip;
}

.app-layout {
  display: flex;
  height: 100vh;
  background: var(--background);
  overflow: hidden;
}

.app-main {
  flex: 1;
  margin-left: 240px;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  background: #f8f7ff;
}

.app-main.no-sidebar {
  margin-left: 0;
}

.mobile-header {
  display: none;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px 24px 32px;
  max-width: 1200px;
}

.main-content.auth-page {
  padding: 0;
  max-width: none;
  overflow: hidden;
}

@media (max-width: 768px) {
  .app-main {
    margin-left: 0;
  }

  .mobile-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: white;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }

  .mobile-brand {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .mobile-brand-icon {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: var(--radius-lg);
    color: white;
    box-shadow: 0 1px 3px rgba(102, 126, 234, 0.2);
  }

  .mobile-brand-icon svg {
    width: 14px;
    height: 14px;
  }

  .mobile-brand-text {
    font-size: 15px;
    font-weight: 600;
    color: var(--foreground);
    letter-spacing: -0.02em;
  }

  .mobile-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .mobile-notif-btn {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: none;
    background: transparent;
    color: var(--muted-foreground);
    cursor: pointer;
    transition: all 0.15s;
  }

  .mobile-notif-btn:hover {
    background: var(--secondary);
  }

  .mobile-notif-btn svg {
    width: 16px;
    height: 16px;
  }

  .mobile-avatar {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    font-size: 12px;
    font-weight: 600;
  }

  .main-content {
    padding: 16px 16px 80px;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 12px 12px 80px;
  }
}
</style>
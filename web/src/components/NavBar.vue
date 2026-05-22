<template>
  <nav class="navbar">
    <div class="navbar-content">
      <div class="navbar-brand" @click="$router.push('/shelf')">
        <div class="brand-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
        </div>
        <span class="brand-text">ReadVault</span>
      </div>
      
      <div class="navbar-links">
        <button 
          class="nav-item" 
          :class="{ active: currentPath === '/shelf' }"
          @click="$router.push('/shelf')"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
          <span>书架</span>
        </button>
        
        <button 
          class="nav-item" 
          :class="{ active: currentPath === '/notes' }"
          @click="$router.push('/notes')"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <span>笔记</span>
        </button>
        
        <button 
          class="nav-item" 
          :class="{ active: currentPath === '/discover' }"
          @click="$router.push('/discover')"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>发现</span>
        </button>
        
        <button 
          class="nav-item" 
          :class="{ active: currentPath === '/search' }"
          @click="$router.push('/search')"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <span>搜索</span>
        </button>
        
        <button 
          class="nav-item" 
          :class="{ active: currentPath === '/statistics' }"
          @click="$router.push('/statistics')"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="16"></line>
          </svg>
          <span>统计</span>
        </button>
        
        <div class="nav-divider"></div>
        
        <button class="nav-item logout" @click="handleLogout">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span>退出</span>
        </button>
      </div>
      
      <button class="navbar-toggle" @click="toggleMobileMenu">
        <svg v-if="!mobileMenuOpen" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    
    <transition name="slide-up">
      <div v-if="mobileMenuOpen" class="mobile-menu">
        <div class="mobile-menu-content">
          <button 
            class="mobile-nav-item" 
            :class="{ active: currentPath === '/shelf' }"
            @click="navigateAndClose('/shelf')"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
            <span>书架</span>
          </button>
          
          <button 
            class="mobile-nav-item" 
            :class="{ active: currentPath === '/notes' }"
            @click="navigateAndClose('/notes')"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <span>笔记</span>
          </button>
          
          <button 
            class="mobile-nav-item" 
            :class="{ active: currentPath === '/discover' }"
            @click="navigateAndClose('/discover')"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>发现</span>
          </button>
          
          <button 
            class="mobile-nav-item" 
            :class="{ active: currentPath === '/search' }"
            @click="navigateAndClose('/search')"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span>搜索</span>
          </button>
          
          <button 
            class="mobile-nav-item" 
            :class="{ active: currentPath === '/statistics' }"
            @click="navigateAndClose('/statistics')"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="16"></line>
            </svg>
            <span>统计</span>
          </button>
          
          <div class="mobile-divider"></div>
          
          <button class="mobile-nav-item logout" @click="handleLogout">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>退出登录</span>
          </button>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { wereadApi } from '@/api/weread'

const router = useRouter()
const mobileMenuOpen = ref(false)

const currentPath = computed(() => router.currentRoute.value.path)

const handleLogout = () => {
  wereadApi.clearApiKey()
  router.push('/auth')
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const navigateAndClose = (path: string) => {
  router.push(path)
  mobileMenuOpen.value = false
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(102, 126, 234, 0.12);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

.navbar-brand:hover {
  opacity: 0.85;
}

.brand-icon {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 10px;
  color: #ffffff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03);
}

.brand-icon svg {
  width: 18px;
  height: 18px;
}

.brand-text {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a2e;
  letter-spacing: -0.02em;
}

.navbar-links {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  background: transparent;
  color: #6b6b8d;
  font-size: 13px;
  font-weight: 500;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-item svg {
  width: 18px;
  height: 18px;
  transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-item:hover {
  background: #ede9fe;
  color: #4c3f8a;
}

.nav-item:hover svg {
  transform: scale(1.05);
}

.nav-item.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #ffffff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03);
}

.nav-item.active:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
}

.nav-item.logout {
  margin-left: 8px;
}

.nav-item.logout:hover {
  background: rgba(212, 24, 61, 0.1);
  color: #d4183d;
}

.nav-divider {
  width: 1px;
  height: 24px;
  background: rgba(102, 126, 234, 0.12);
  margin: 0 8px;
}

.navbar-toggle {
  display: none;
  background: transparent;
  border: none;
  color: #1a1a2e;
  cursor: pointer;
  padding: 8px;
  border-radius: 10px;
  transition: background 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

.navbar-toggle:hover {
  background: #ede9fe;
}

.navbar-toggle svg {
  width: 22px;
  height: 22px;
}

.mobile-menu {
  position: fixed;
  top: 62px;
  left: 0;
  right: 0;
  background: #ffffff;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.05);
  border-radius: 0 0 16px 16px;
  overflow: hidden;
}

.mobile-menu-content {
  padding: 8px;
}

.mobile-nav-item {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 14px 20px;
  border: none;
  background: transparent;
  color: #1a1a2e;
  font-size: 15px;
  font-weight: 500;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
}

.mobile-nav-item svg {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
}

.mobile-nav-item:hover {
  background: #ede9fe;
}

.mobile-nav-item.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #ffffff;
}

.mobile-nav-item.logout {
  color: #d4183d;
}

.mobile-nav-item.logout:hover {
  background: rgba(212, 24, 61, 0.1);
}

.mobile-divider {
  height: 1px;
  background: rgba(102, 126, 234, 0.12);
  margin: 8px 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

@media (max-width: 768px) {
  .navbar-content {
    padding: 10px 16px;
  }
  
  .navbar-links {
    display: none;
  }
  
  .navbar-toggle {
    display: flex;
  }
  
  .brand-text {
    font-size: 18px;
  }
  
  .brand-icon {
    width: 30px;
    height: 30px;
  }
  
  .brand-icon svg {
    width: 16px;
    height: 16px;
  }
}
</style>
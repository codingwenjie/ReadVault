<template>
  <div class="auth-container">
    <div class="bg-gradient"></div>
    <div class="bg-circle bg-circle-1"></div>
    <div class="bg-circle bg-circle-2"></div>
    
    <div class="auth-card">
      <div class="logo-section">
        <div class="logo-wrap">
          <svg viewBox="0 0 24 24" fill="none" class="logo-icon">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" fill="currentColor" opacity="0.9"/>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" fill="currentColor" opacity="0.6"/>
          </svg>
        </div>
        <h1 class="title">ReadVault</h1>
        <p class="subtitle">微信读书数据管理助手</p>
      </div>

      <div class="form-section">
        <div class="input-group">
          <label class="input-label">API Key</label>
          <div class="input-wrapper" :class="{ focused: isFocused, error: !!error }">
            <svg viewBox="0 0 24 24" fill="none" class="input-icon">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <input
              v-model="apiKey"
              type="password"
              placeholder="wrk-xxxxxxxx"
              class="api-input"
              @focus="isFocused = true"
              @blur="isFocused = false"
              @keyup.enter="handleSubmit"
            />
          </div>
        </div>
        
        <button
          class="submit-btn"
          :class="{ loading }"
          :disabled="loading || !apiKey.trim()"
          @click="handleSubmit"
        >
          <span v-if="!loading" class="btn-text">{{ apiKey.startsWith('wrk-') ? '验证并登录' : '连接微信读书' }}</span>
          <span v-else class="btn-loading">
            <svg class="spin-icon" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="32" stroke-linecap="round"/></svg>
            验证中...
          </span>
        </button>
      </div>

      <transition name="slide-fade">
        <div v-if="error" class="error-message">
          <svg viewBox="0 0 24 24" fill="none" class="error-icon">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span>{{ error }}</span>
        </div>
      </transition>

      <div class="tips">
        <div class="tips-header">
          <svg viewBox="0 0 24 24" fill="none" class="tips-icon">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <path d="M12 16v-4M12 8h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span>如何获取 API Key</span>
        </div>
        <ol class="tips-steps">
          <li>打开<strong>微信读书 App</strong></li>
          <li>进入「我」→「设置」→「关于微信读书」</li>
          <li>复制显示的 API Key（格式：<code>wrk-</code>开头）</li>
        </ol>
        <p class="tips-note">⚠️ 若验证失败，请重新获取 Key 后再试</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { wereadApi } from '@/api/weread'

const router = useRouter()
const apiKey = ref('')
const loading = ref(false)
const error = ref('')
const isFocused = ref(false)

const handleSubmit = async () => {
  if (!apiKey.value.trim()) {
    error.value = '请输入 API Key'
    return
  }

  if (!apiKey.value.startsWith('wrk-')) {
    error.value = 'API Key 格式不正确，应以 wrk- 开头'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await wereadApi.verifyApiKey(apiKey.value)
    if (response.code === 0 && response.data) {
      wereadApi.setApiKey(apiKey.value)
      ElMessage.success('验证成功！')
      router.push('/shelf')
    } else {
      error.value = response.msg || 'API Key 验证失败，请检查是否正确'
    }
  } catch (e) {
    error.value = '网络错误，请检查网络后重试'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f4ff 0%, #ede9fe 50%, #e0e7ff 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.bg-gradient {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(ellipse 80% 60% at 20% 30%, rgba(102, 126, 234, 0.08) 0%, transparent 60%),
    radial-gradient(ellipse 60% 50% at 80% 70%, rgba(118, 75, 162, 0.06) 0%, transparent 60%);
  pointer-events: none;
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.5;
  pointer-events: none;
}

.bg-circle-1 {
  width: 400px;
  height: 400px;
  background: rgba(102, 126, 234, 0.1);
  top: -100px;
  right: -100px;
  animation: float-slow 20s ease-in-out infinite;
}

.bg-circle-2 {
  width: 300px;
  height: 300px;
  background: rgba(118, 75, 162, 0.08);
  bottom: -80px;
  left: -80px;
  animation: float-slow 25s ease-in-out infinite reverse;
}

@keyframes float-slow {
  0%, 100% { transform: translate(0, 0); }
  33% { transform: translate(20px, -20px); }
  66% { transform: translate(-15px, 15px); }
}

.auth-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 40px 36px;
  box-shadow: 
    0 1px 2px rgba(0, 0, 0, 0.04),
    0 4px 16px rgba(102, 126, 234, 0.08),
    0 24px 48px rgba(102, 126, 234, 0.04);
  max-width: 400px;
  width: 100%;
  position: relative;
  z-index: 1;
  border: 1px solid rgba(102, 126, 234, 0.08);
}

.logo-section {
  text-align: center;
  margin-bottom: 36px;
}

.logo-wrap {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
}

.logo-icon {
  width: 32px;
  height: 32px;
  color: #fff;
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: #1e1b4b;
  margin: 0 0 6px 0;
  letter-spacing: -0.02em;
}

.subtitle {
  font-size: 14px;
  color: #9ca3af;
  margin: 0;
  font-weight: 400;
}

.form-section {
  margin-bottom: 24px;
}

.input-group {
  margin-bottom: 16px;
}

.input-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
  letter-spacing: 0.01em;
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1.5px solid #e5e7eb;
  background: #fafafa;
  transition: all 200ms ease;
}

.input-wrapper:hover {
  border-color: #c4b5fd;
  background: #fff;
}

.input-wrapper.focused {
  border-color: #667eea;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.08);
}

.input-wrapper.error {
  border-color: #ef4444;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.06);
}

.input-icon {
  width: 18px;
  height: 18px;
  color: #9ca3af;
  flex-shrink: 0;
  transition: color 200ms;
}

.input-wrapper.focused .input-icon,
.input-wrapper:hover .input-icon {
  color: #667eea;
}

.input-wrapper.error .input-icon {
  color: #ef4444;
}

.api-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: #1e1b4b;
  font-weight: 500;
  letter-spacing: 0.02em;
}

.api-input::placeholder {
  color: #c4b5fd;
  font-weight: 400;
}

.submit-btn {
  width: 100%;
  height: 48px;
  font-size: 15px;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 250ms ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  box-shadow: 0 4px 14px rgba(102, 126, 234, 0.35);
}

.submit-btn:hover:not(:disabled):not(.loading) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.45);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0) scale(0.98);
}

.submit-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  box-shadow: none;
}

.btn-text {
  white-space: nowrap;
}

.btn-loading {
  display: flex;
  align-items: center;
  gap: 8px;
}

.spin-icon {
  width: 18px;
  height: 18px;
  animation: spin 0.8s linear infinite;
  color: currentColor;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message {
  display: flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  color: #dc2626;
  padding: 12px 16px;
  border-radius: 12px;
  margin-bottom: 20px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid rgba(220, 38, 38, 0.12);
}

.error-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  color: #ef4444;
}

.tips {
  background: linear-gradient(135deg, #fafaff 0%, #f5f3ff 100%);
  padding: 16px 18px;
  border-radius: 14px;
  border: 1px solid rgba(102, 126, 234, 0.08);
}

.tips-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: 600;
  color: #4c3f8a;
}

.tips-icon {
  width: 16px;
  height: 16px;
  color: #667eea;
}

.tips-steps {
  margin: 0 0 10px;
  padding-left: 18px;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.8;
}

.tips-steps li {
  margin-bottom: 4px;
}

.tips-steps strong {
  color: #374151;
  font-weight: 600;
}

.tips-steps code {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  font-family: inherit;
}

.tips-note {
  margin: 0;
  font-size: 12px;
  color: #f59e0b;
  font-weight: 500;
  padding-top: 10px;
  border-top: 1px dashed rgba(102, 126, 234, 0.12);
}

.slide-fade-enter-active {
  transition: all 0.25s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (max-width: 480px) {
  .auth-card {
    padding: 32px 24px;
    border-radius: 16px;
  }
  
  .logo-wrap {
    width: 56px;
    height: 56px;
    border-radius: 14px;
  }
  
  .logo-icon {
    width: 28px;
    height: 28px;
  }
  
  .title {
    font-size: 21px;
  }
  
  .submit-btn {
    height: 44px;
    font-size: 14px;
  }
}
</style>
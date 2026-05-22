<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="logo-section">
        <div class="logo">📚</div>
        <h1 class="title">ReadVault</h1>
        <p class="subtitle">微信读书助手</p>
      </div>

      <div class="form-section">
        <el-input
          v-model="apiKey"
          type="password"
          placeholder="请输入微信读书 API Key"
          class="api-input"
          @keyup.enter="handleSubmit"
        />
        
        <el-button
          type="primary"
          class="submit-btn"
          :loading="loading"
          @click="handleSubmit"
        >
          {{ loading ? '验证中...' : '登录' }}
        </el-button>
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div class="tips">
        <p>📌 API Key 格式: <code>wrk-xxxxxxxx</code></p>
        <p>💡 如何获取 API Key？</p>
        <p>1. 打开微信读书 App</p>
        <p>2. 进入「我」→「设置」→「关于微信读书」</p>
        <p class="warning">⚠️ 若提示鉴权失败，请尝试重新获取 API Key</p>
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
      error.value = response.msg || 'API Key 验证失败'
    }
  } catch (e) {
    error.value = '网络错误，请稍后重试'
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.auth-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  max-width: 400px;
  width: 100%;
}

.logo-section {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  font-size: 64px;
  margin-bottom: 16px;
}

.title {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin: 0 0 8px 0;
}

.subtitle {
  font-size: 14px;
  color: #999;
  margin: 0;
}

.form-section {
  margin-bottom: 20px;
}

.api-input {
  margin-bottom: 16px;
}

.submit-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
}

.error-message {
  background: #fef2f2;
  color: #dc2626;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
}

.tips {
  background: #f8fafc;
  padding: 16px;
  border-radius: 8px;
}

.tips p {
  margin: 8px 0;
  font-size: 13px;
  color: #64748b;
}

.tips code {
  background: #e2e8f0;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}
</style>
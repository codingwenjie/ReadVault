import express from 'express'
import { wereadClient } from '../client/weread'

const router = express.Router()

// 中间件：从请求头获取 API Key 并设置到 client
router.use((req, res, next) => {
  const apiKey = req.headers['x-weread-api-key'] as string
  if (apiKey) {
    wereadClient.setApiKey(apiKey)
  }
  next()
})

router.get('/shelf', async (req, res) => {
  try {
    const result = await wereadClient.shelf()
    res.json({ code: 0, data: result, msg: 'success' })
  } catch (error) {
    res.json({ code: -1, data: null, msg: error instanceof Error ? error.message : 'Unknown error' })
  }
})

router.get('/notebooks', async (req, res) => {
  try {
    const { count = 20, lastSort } = req.query
    const result = await wereadClient.notebooks(Number(count), lastSort ? Number(lastSort) : undefined)
    res.json({ code: 0, data: result, msg: 'success' })
  } catch (error) {
    res.json({ code: -1, data: null, msg: error instanceof Error ? error.message : 'Unknown error' })
  }
})

router.get('/bookmarks/:bookId', async (req, res) => {
  try {
    const { bookId } = req.params
    const result = await wereadClient.bookmarks(bookId)
    res.json({ code: 0, data: result, msg: 'success' })
  } catch (error) {
    res.json({ code: -1, data: null, msg: error instanceof Error ? error.message : 'Unknown error' })
  }
})

router.get('/reviews/:bookId', async (req, res) => {
  try {
    const { bookId } = req.params
    const { synckey = 0, count = 20 } = req.query
    const result = await wereadClient.reviews(bookId, Number(synckey), Number(count))
    res.json({ code: 0, data: result, msg: 'success' })
  } catch (error) {
    res.json({ code: -1, data: null, msg: error instanceof Error ? error.message : 'Unknown error' })
  }
})

router.get('/readdata', async (req, res) => {
  try {
    const { mode = 'monthly', baseTime } = req.query
    const result = await wereadClient.readdata(mode as string, baseTime ? Number(baseTime) : undefined)
    res.json({ code: 0, data: result, msg: 'success' })
  } catch (error) {
    res.json({ code: -1, data: null, msg: error instanceof Error ? error.message : 'Unknown error' })
  }
})

router.get('/book/info/:bookId', async (req, res) => {
  try {
    const { bookId } = req.params
    const result = await wereadClient.bookInfo(bookId)
    res.json({ code: 0, data: result, msg: 'success' })
  } catch (error) {
    res.json({ code: -1, data: null, msg: error instanceof Error ? error.message : 'Unknown error' })
  }
})

router.get('/book/progress/:bookId', async (req, res) => {
  try {
    const { bookId } = req.params
    const result = await wereadClient.bookProgress(bookId)
    res.json({ code: 0, data: result, msg: 'success' })
  } catch (error) {
    res.json({ code: -1, data: null, msg: error instanceof Error ? error.message : 'Unknown error' })
  }
})

router.get('/search', async (req, res) => {
  try {
    const { keyword, scope = 10, maxIdx = 0, count } = req.query
    const result = await wereadClient.search(
      keyword as string,
      Number(scope),
      Number(maxIdx),
      count ? Number(count) : undefined
    )
    res.json({ code: 0, data: result, msg: 'success' })
  } catch (error) {
    res.json({ code: -1, data: null, msg: error instanceof Error ? error.message : 'Unknown error' })
  }
})

router.get('/recommend', async (req, res) => {
  try {
    const { count = 12, maxIdx = 0 } = req.query
    const result = await wereadClient.recommend(Number(count), Number(maxIdx))
    res.json({ code: 0, data: result, msg: 'success' })
  } catch (error) {
    res.json({ code: -1, data: null, msg: error instanceof Error ? error.message : 'Unknown error' })
  }
})

router.get('/similar/:bookId', async (req, res) => {
  try {
    const { bookId } = req.params
    const { count = 12, maxIdx = 0, sessionId } = req.query
    const result = await wereadClient.similar(
      bookId,
      Number(count),
      Number(maxIdx),
      sessionId as string | undefined
    )
    res.json({ code: 0, data: result, msg: 'success' })
  } catch (error) {
    res.json({ code: -1, data: null, msg: error instanceof Error ? error.message : 'Unknown error' })
  }
})

router.post('/verify', async (req, res) => {
  try {
    const { apiKey } = req.body
    const result = await wereadClient.verifyApiKey(apiKey)
    if (result) {
      res.json({ code: 0, data: result, msg: '验证成功' })
    } else {
      res.json({ code: -1, data: result, msg: 'API Key 验证失败' })
    }
  } catch (error) {
    res.json({ code: -1, data: null, msg: error instanceof Error ? error.message : 'Unknown error' })
  }
})

export default router
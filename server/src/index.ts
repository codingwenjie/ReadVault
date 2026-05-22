import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import wereadRoutes from './routes/weread'

dotenv.config()

const app = express()
const port = process.env.SERVER_PORT || 3000

app.use(cors())
app.use(express.json())

app.use('/api/weread', wereadRoutes)

app.get('/api/health', (req, res) => {
  res.json({ code: 0, data: 'OK', msg: 'Server is running' })
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
import express from 'express'
import cors from 'cors'
import { parseRouter } from './routes/parse'
import { proxyRouter } from './routes/proxy'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use('/api', parseRouter)
app.use('/api', proxyRouter)

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`)
})
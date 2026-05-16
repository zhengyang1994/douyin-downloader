import { Router, Request, Response } from 'express'
import { parseDouyinUrl } from '../services/douyin'

export const parseRouter = Router()

parseRouter.post('/parse', async (req: Request, res: Response) => {
  try {
    const { url } = req.body

    if (!url || typeof url !== 'string') {
      res.status(400).json({ success: false, error: '请提供有效的抖音链接' })
      return
    }

    const douyinRegex = /https?:\/\/(v\.douyin\.com|www\.douyin\.com|www\.iesdouyin\.com)\/\S+/i
    if (!douyinRegex.test(url)) {
      res.status(400).json({ success: false, error: '请输入有效的抖音分享链接' })
      return
    }

    const result = await parseDouyinUrl(url)
    res.json({ success: true, data: result })
  } catch (error) {
    const message = error instanceof Error ? error.message : '解析失败，请稍后重试'
    res.status(500).json({ success: false, error: message })
  }
})
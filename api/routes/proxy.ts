import { Router, Request, Response } from 'express'
import axios from 'axios'

export const proxyRouter = Router()

proxyRouter.get('/proxy-download', async (req: Request, res: Response) => {
  try {
    const { url, filename } = req.query

    if (!url || typeof url !== 'string') {
      res.status(400).json({ error: '缺少下载地址' })
      return
    }

    const decodedUrl = decodeURIComponent(url)

    const response = await axios.get(decodedUrl, {
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
        'Referer': 'https://www.douyin.com/',
      },
      timeout: 60000,
    })

    const contentType = response.headers['content-type'] || 'application/octet-stream'
    res.setHeader('Content-Type', contentType)
    res.setHeader('Content-Length', response.headers['content-length'] || '0')

    const safeFilename = typeof filename === 'string'
      ? encodeURIComponent(filename)
      : 'download'
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${safeFilename}`)

    response.data.pipe(res)
  } catch (error) {
    const message = error instanceof Error ? error.message : '下载失败'
    res.status(500).json({ error: message })
  }
})
import axios from 'axios'
import * as cheerio from 'cheerio'
import type { VideoResource, ImageResource } from '../../shared/types'

const USER_AGENT = 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'

interface DouyinPageData {
  title: string
  author: string
  cover: string
  duration: number
  type: 'video' | 'image'
  videoUrls: { label: string; url: string; width: number; height: number }[]
  images: { url: string; thumb: string; width: number; height: number }[]
}

async function fetchDouyinPage(url: string): Promise<string> {
  const response = await axios.get(url, {
    headers: {
      'User-Agent': USER_AGENT,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'zh-CN,zh;q=0.9',
    },
    maxRedirects: 5,
    timeout: 15000,
  })

  return response.data
}

function extractDataFromHtml(html: string): DouyinPageData | null {
  const $ = cheerio.load(html)

  const scripts = $('script').toArray()
  let pageData: Record<string, unknown> | null = null

  for (const script of scripts) {
    const content = $(script).html() || ''
    if (content.includes('"aweme_id"') || content.includes('"awemeId"')) {
      try {
        const jsonMatch = content.match(/\{[\s\S]*"aweme_id"[\s\S]*\}/)
        if (jsonMatch) {
          pageData = JSON.parse(jsonMatch[0])
          break
        }
      } catch {
        continue
      }
    }
  }

  if (!pageData) {
    const title = $('title').text().trim() || $('meta[property="og:title"]').attr('content') || ''
    const description = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || ''
    const image = $('meta[property="og:image"]').attr('content') || ''
    const videoUrl = $('meta[property="og:video:url"]').attr('content') || $('meta[property="og:video"]').attr('content') || ''

    if (videoUrl) {
      return {
        title: title || '抖音视频',
        author: '',
        cover: image,
        duration: 0,
        type: 'video',
        videoUrls: [{
          label: '高清',
          url: videoUrl,
          width: 1920,
          height: 1080,
        }],
        images: [],
      }
    }

    if (image) {
      return {
        title: title || '抖音图集',
        author: '',
        cover: image,
        duration: 0,
        type: 'image',
        videoUrls: [],
        images: [{
          url: image,
          thumb: image,
          width: 1080,
          height: 1920,
        }],
      }
    }

    return null
  }

  const awemeDetail = (pageData as Record<string, unknown>)?.aweme_detail || pageData
  const detail = awemeDetail as Record<string, unknown>

  const isImage = detail.images && Array.isArray(detail.images) && detail.images.length > 0

  if (isImage) {
    const images = (detail.images as Array<Record<string, unknown>>).map((img) => {
      const urlList = img.url_list as string[] | undefined
      const thumbList = img.thumb_url_list as string[] | undefined
      return {
        url: urlList?.[0] || '',
        thumb: thumbList?.[0] || urlList?.[0] || '',
        width: (img.width as number) || 1080,
        height: (img.height as number) || 1920,
      }
    })

    return {
      title: (detail.desc as string) || '抖音图集',
      author: ((detail.author as Record<string, unknown>)?.nickname as string) || '',
      cover: ((detail.video as Record<string, unknown>)?.cover?.url_list as string[])?.[0] || images[0]?.thumb || '',
      duration: 0,
      type: 'image',
      videoUrls: [],
      images,
    }
  }

  const video = detail.video as Record<string, unknown> | undefined
  const videoUrls: { label: string; url: string; width: number; height: number }[] = []

  if (video) {
    const playAddr = video.play_addr as Record<string, unknown> | undefined
    if (playAddr?.url_list && Array.isArray(playAddr.url_list)) {
      videoUrls.push({
        label: '标清',
        url: (playAddr.url_list as string[])[0] || '',
        width: (playAddr.width as number) || 720,
        height: (playAddr.height as number) || 1280,
      })
    }

    const bitRateList = (video.bit_rate || []) as Array<Record<string, unknown>>
    for (const bitRate of bitRateList) {
      const playAddr = bitRate.play_addr as Record<string, unknown> | undefined
      if (playAddr?.url_list && Array.isArray(playAddr.url_list)) {
        const height = bitRate.gear_name as string || ''
        const label = height ? `${height}p` : '高清'
        videoUrls.push({
          label,
          url: (playAddr.url_list as string[])[0] || '',
          width: (playAddr.width as number) || 1080,
          height: (playAddr.height as number) || 1920,
        })
      }
    }
  }

  if (videoUrls.length === 0) {
    const downloadAddr = video?.download_addr as Record<string, unknown> | undefined
    if (downloadAddr?.url_list && Array.isArray(downloadAddr.url_list)) {
      videoUrls.push({
        label: '高清',
        url: (downloadAddr.url_list as string[])[0] || '',
        width: (downloadAddr.width as number) || 1080,
        height: (downloadAddr.height as number) || 1920,
      })
    }
  }

  return {
    title: (detail.desc as string) || '抖音视频',
    author: ((detail.author as Record<string, unknown>)?.nickname as string) || '',
    cover: (video?.cover?.url_list as string[])?.[0] || '',
    duration: Math.floor(((detail.duration || video?.duration || 0) as number) / 1000),
    type: 'video',
    videoUrls,
    images: [],
  }
}

export async function parseDouyinUrl(url: string): Promise<VideoResource | ImageResource> {
  const html = await fetchDouyinPage(url)
  const data = extractDataFromHtml(html)

  if (!data) {
    throw new Error('无法解析该链接，请确认链接有效且为公开内容')
  }

  if (data.type === 'image') {
    const result: ImageResource = {
      type: 'image',
      title: data.title,
      author: data.author,
      images: data.images.map((img) => ({
        url: `/api/proxy-download?url=${encodeURIComponent(img.url)}&filename=${encodeURIComponent('image.jpg')}`,
        thumb: img.thumb,
        width: img.width,
        height: img.height,
      })),
    }
    return result
  }

  const result: VideoResource = {
    type: 'video',
    title: data.title,
    cover: data.cover,
    duration: data.duration,
    author: data.author,
    resolutions: data.videoUrls.map((v) => ({
      label: v.label,
      url: v.url,
      width: v.width,
      height: v.height,
    })),
  }

  return result
}
import * as cheerio from 'cheerio'

const DEFAULT_URL = 'https://btsow.club/'

const headers = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.87 Safari/537.36',
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
  'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6',
}

const fetchWithTimeout = async (
  url,
  options,
  opts = { timeout: 7000, cacheTtl: 5 },
) => {
  return Promise.race([
    fetch(url, {
      cf: {
        cacheTtl: opts.cacheTtl,
        cacheKey: url,
      },
      ...options,
    }),
    new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error(`timeout: ${opts.timeout}`)),
        opts.timeout,
      ),
    ),
  ])
}

const getUrls = async () => {
  const response = await fetchWithTimeout('https://tellme.pw/btsow', {
    headers,
  })
  const data = await response.text()
  const $ = cheerio.load(data)
  const urls = $('h2')
    .map((_, el) => {
      const e = $(el).find('a')
      return e.attr().href
    })
    .get()

  return urls
}

const getValidUrl = async urls => {
  if (urls.length === 0) {
    return DEFAULT_URL
  }
  for (const url of urls) {
    const response = await fetchWithTimeout(url, {
      headers,
    })
    const data = await response.text()
    if (/Select \.torrent file/.test(data)) {
      return url
    }
  }
  return DEFAULT_URL
}

const callApi = async () => {
  const urls = await getUrls()
  return getValidUrl(urls)
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  const url = await callApi()
  return new Response(url, {
    headers: {
      'content-type': 'text/plain',
      'Cache-Control': 'max-age=60',
    },
  })
}

import * as cheerio from 'cheerio'

const DEFAULT_URLS = {
  btso: 'https://btsow.club/',
  avmo: 'https://avmask.com/',
  avsox: 'https://avsox.host/',
  avmemo: 'https://avmemo.asia/',
}

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

const getUrls = async (url, elClass) => {
  const response = await fetchWithTimeout(url, {
    headers,
  })
  const data = await response.text()
  const $ = cheerio.load(data)
  const urls = $(elClass)
    .map((_, el) => {
      const e = $(el).find('a')
      return e.attr().href
    })
    .get()

  return urls
}

const getValidUrl = async (urls, validFunc, defaultUrl) => {
  if (urls.length === 0) {
    return defaultUrl
  }
  for (const url of urls) {
    const response = await fetchWithTimeout(url, {
      headers,
    })
    const data = await response.text()
    if (validFunc(data)) {
      return url
    }
  }
  return defaultUrl
}

export const callBtsoApi = async () => {
  try {
    const urls = await getUrls('https://tellme.pw/btsow', 'h2')
    return getValidUrl(
      urls,
      data => /Select \.torrent file/.test(data),
      DEFAULT_URLS['btso'],
    )
  } catch (err) {
    console.log(err)
    return DEFAULT_URLS['btso']
  }
}

export const callAvmooApi = async () => {
  try {
    const urls = await getUrls('https://tellme.pw/avmo', 'h4')
    return getValidUrl(
      urls,
      data => /简体中文/.test(data),
      DEFAULT_URLS['avmo'],
    )
  } catch (err) {
    console.log(err)
    return DEFAULT_URLS['avmo']
  }
}

export const callAvsoxApi = async () => {
  try {
    const urls = await getUrls('https://tellme.pw/avsox', 'h4')
    return getValidUrl(
      urls,
      data => /简体中文/.test(data),
      DEFAULT_URLS['avsox'],
    )
  } catch (err) {
    console.log(err)
    return DEFAULT_URLS['avsox']
  }
}

export const callAvmemoApi = async () => {
  try {
    const urls = await getUrls('https://tellme.pw/avmemo', 'h4')
    return getValidUrl(
      urls,
      data => /简体中文/.test(data),
      DEFAULT_URLS['avmemo'],
    )
  } catch (err) {
    console.log(err)
    return DEFAULT_URLS['avmemo']
  }
}

import { callBtsoApi } from './api'
import { getAll } from './getConfig'

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  let requestURL = new URL(request.url)
  let path = requestURL.pathname
  if (path === '/config') {
    const urls = await getAll()
    return new Response(JSON.stringify(urls), {
      headers: {
        'content-type': 'application/json',
        'Cache-Control': 'max-age=60',
      },
    })
  }

  const url = await callBtsoApi()
  return new Response(url, {
    headers: {
      'content-type': 'text/plain',
      'Cache-Control': 'max-age=60',
    },
  })
}

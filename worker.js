addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // 1) Let’s assume /panel/:id is the pattern you want
  const url = new URL(request.url)
  if (url.pathname.startsWith('/panel/')) {
    // 2) Fetch the real page from your origin
    const originResponse = await fetch(request)
    let html = await originResponse.text()

    const title = 'WRAVEN Threat Intellegence'
    const desc = 'This is a short description for link previews.'
    const img  = 'https://github.com/WRAVENproject/wraven.org/blob/main/imgs/og-image.png?raw=true'

    // 4) Inject the meta tags into the <head>
    const metaTags = `
      <meta property="og:title" content="${title}" />
      <meta property="og:description" content="${desc}" />
      <meta property="og:image" content="${img}" />
      <meta property="og:url" content="${request.url}" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${title}" />
      <meta name="twitter:description" content="${desc}" />
      <meta name="twitter:image" content="${img}" />
    `
    // Insert right after <head>
    html = html.replace('<head>', `<head>${metaTags}`)

    // 5) Return the modified HTML with the same status/headers
    const newHeaders = new Headers(originResponse.headers)
    newHeaders.set('Content-Type', 'text/html;charset=UTF-8')
    return new Response(html, {
      status: originResponse.status,
      headers: newHeaders
    })
  }

  // For any other path, just proxy normally
  return fetch(request)
}

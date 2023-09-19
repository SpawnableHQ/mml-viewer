import { MmlWsRenderer } from '../features/MmlWsRenderer'
import { MmlUrlRenderer } from '../features/MmlUrlRenderer'

export function RenderPage() {
  const query = new URLSearchParams(window.location.search)
  const url = query.get('url')
  const isWebsocket = url?.startsWith('wss://') ?? false

  if (!url) {
    return null
  }

  return isWebsocket ? <MmlWsRenderer url={url} /> : <MmlUrlRenderer url={url} />
}

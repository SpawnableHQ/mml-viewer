import { useEffect, useState } from 'react'
import { toLightEnhancedCode } from './helpers'
import { CloseableClient } from './CloseableClient'
import { EditableNetworkedDOM, IframeObservableDOMFactory } from 'mml-web-runner'

type Props = {
  url: string
}

export function MmlUrlRenderer(props: Props) {
  const [code, setCode] = useState<string | null>(null)
  const [networkedDOMDocument, setNetworkedDOMDocument] = useState<EditableNetworkedDOM | null>(null)

  useEffect(() => {
    fetch(props.url)
      .then((response) => response.text())
      .then((code) => setCode(code))
  }, [props.url])

  useEffect(() => {
    const document = new EditableNetworkedDOM('http://example.com/index.html', IframeObservableDOMFactory, true)
    setNetworkedDOMDocument(document)

    return () => {
      document.dispose()
    }
  }, [])

  useEffect(() => {
    if (!code) return
    networkedDOMDocument?.load(toLightEnhancedCode(code))
  }, [networkedDOMDocument, code])

  if (!networkedDOMDocument) {
    return null
  }

  return <CloseableClient document={networkedDOMDocument} />
}

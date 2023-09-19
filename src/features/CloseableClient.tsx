import { getIframeTargetWindow } from './helpers'
import { MMLWebRunnerClient } from 'mml-web-runner'
import { useEffect, useRef, useState } from 'react'
import { NetworkedDOM, EditableNetworkedDOM } from '@mml-io/networked-dom-document'

type Props = {
  document: NetworkedDOM | EditableNetworkedDOM
}

export function CloseableClient(props: Props) {
  const [client, setClient] = useState<MMLWebRunnerClient | null>(null)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let disposed = false
    let runnerClient: MMLWebRunnerClient | null = null
    getIframeTargetWindow().then((wrapper) => {
      if (disposed) return
      runnerClient = new MMLWebRunnerClient(wrapper.iframeWindow, wrapper.iframeBody)
      runnerClient.connect(props.document)
      setClient(runnerClient)
    })

    setTimeout(() => {
      client?.fitContainer()
    }, 100)

    return () => {
      disposed = true
      if (runnerClient) {
        runnerClient.dispose()
      }
    }
  }, [client, props.document])

  useEffect(() => {
    if (!elementRef.current || !client) return
    elementRef.current.appendChild(client.element)
  }, [client])

  if (!client) {
    return null
  }

  return <div className="w-full h-full overflow-hidden" ref={elementRef} />
}

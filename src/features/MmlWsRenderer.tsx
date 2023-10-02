import * as THREE from 'three'
import React, { useEffect } from 'react'
import { FullScreenMScene, RemoteDocumentWrapper, NetworkedDOMWebsocket } from 'mml-web'

type Props = {
  url: string
}

export function MmlWsRenderer(props: Props) {
  useEffect(() => {
    if (!props.url) return
    const fullScreenMScene = new FullScreenMScene()

    const ambientLight = new THREE.AmbientLight(0x404040)
    fullScreenMScene.getThreeScene().add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(0, 1, 1)
    fullScreenMScene.getThreeScene().add(directionalLight)

    const camera = fullScreenMScene.getCamera()
    camera.position.set(-5, 5, 15)
    camera.lookAt(0, 0, 0)

    let overriddenHandler: ((element: HTMLElement, event: CustomEvent) => void) | null = null
    const eventHandler = (element: HTMLElement, event: CustomEvent) => {
      if (!overriddenHandler) {
        throw new Error('overriddenHandler not set')
      }
      overriddenHandler(element, event)
    }

    const remoteDocumentWrapper = new RemoteDocumentWrapper(window.location.href, window, fullScreenMScene, eventHandler)
    document.body.append(remoteDocumentWrapper.element)

    const websocket = new NetworkedDOMWebsocket(
      props.url,
      NetworkedDOMWebsocket.createWebSocket,
      remoteDocumentWrapper.element,
      (time: number) => remoteDocumentWrapper.setDocumentTime(time),
      (status: any) => console.log('status', status)
    )

    overriddenHandler = (element: HTMLElement, event: CustomEvent) => {
      websocket.handleEvent(element, event)
    }

    const container = document.getElementById('container')
    if (container) {
      container.innerHTML = ''
      container.append(fullScreenMScene.element)
    }
  }, [])

  return <div id="container" style={{ width: '100vw', height: '100vh' }} />
}

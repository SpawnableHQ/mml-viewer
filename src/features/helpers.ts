import { IframeWrapper, IframeWrapperResult, registerCustomElementsToWindow } from 'mml-web'

let iframeRemoteSceneWrapperPromise: Promise<IframeWrapperResult> | null = null

export const getIframeTargetWindow = async (): Promise<IframeWrapperResult> => {
  if (iframeRemoteSceneWrapperPromise !== null) {
    return await iframeRemoteSceneWrapperPromise
  }

  const wrapper = await IframeWrapper.create()
  registerCustomElementsToWindow(wrapper.iframeWindow)
  iframeRemoteSceneWrapperPromise = Promise.resolve(wrapper)

  return wrapper
}

export const toLightEnhancedCode = (code: string) =>
  `<m-plane color="white" width="20" height="20" rx="-90"></m-plane><m-light type="point" x="10" y="10" z="10"></m-light>${code}`

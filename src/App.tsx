import React from 'react'
import './App.css'
import { RenderPage } from './pages/RenderPage'
import { registerCustomElementsToWindow } from 'mml-web'

registerCustomElementsToWindow(window)

export default function App() {
  return <RenderPage />
}

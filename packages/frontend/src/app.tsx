import React, { FC } from 'react'
import ReactDOM from 'react-dom'
import RootPage from './pages/index'
import './index.css'

const App:FC = () => {
  return <RootPage />
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)

import React, { FC } from 'react'
import ReactDOM from 'react-dom'
import RootPage from './pages/index'
import './index.css'
import { GlazeI18n } from '@glaze/common'
import { initReactI18next } from 'react-i18next'
import { ChakraProvider } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import './mocks/init'

GlazeI18n.initI18n(initReactI18next)

const queryClient = new QueryClient()

const App:FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <RootPage />
      </ChakraProvider>
    </QueryClientProvider>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)

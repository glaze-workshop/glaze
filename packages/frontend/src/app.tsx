import React, { FC } from 'react'
import RootPage from './pages/index'
import './index.css'
import { GlazeI18n } from '@glaze/common'
import { initReactI18next } from 'react-i18next'
import { ChakraProvider } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'
import { ReactQueryDevtools } from 'react-query/devtools'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'systemjs'
import { queryClient } from './utils/queryClient'
import { render } from 'react-dom'
dayjs.extend(relativeTime)

// eslint-disable-next-line no-undef
System.set('app:react', { default: React, __useDefault: true })

GlazeI18n.initI18n(initReactI18next)

const App: FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <BrowserRouter>
          <RootPage />
        </BrowserRouter>
      </ChakraProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)

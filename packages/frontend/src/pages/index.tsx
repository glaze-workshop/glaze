import React, { FC, Suspense } from 'react'
import {
  BrowserRouter,
  Navigate,
  Route,
  Router,
  Routes
} from 'react-router-dom'
import { useAxiosConfig } from '../hooks/axios'
import Folder from './folder'
import Home from './home'
import Login from './login'
import Register from './register'
import Dashboard from './project/dashboard/dashboard'
import { useWebSocketMessage } from '../hooks/websocket'
import Setting from './project/dashboard/setting/setting'
import Analysis from './project/dashboard/analysis/analysis'
import ProjectPlugin from './project/dashboard/analysis/plugin'
import BasicAnalysis from './project/dashboard/analysis/basic'
import Overview from './project/dashboard/overview/overview'
import TeamPlugin from './teamPlugin'
import PluginMarket from './project/dashboard/analysis/plugin-market'
import Heatmap from './project/dashboard/analysis/heatmap'
import PluginConfig from './project/dashboard/analysis/plugin/config'

const LazyEditor = React.lazy(() => import('./project/index'))

const RootPage: FC = () => {
  useAxiosConfig()
  useWebSocketMessage()

  return (
    <Routes>
      <Route path="/" element={<Home />}>
        <Route path="folder/:folderId" element={<Folder />} />
        <Route path='team-plugin/:teamId' element={<TeamPlugin/>}/>
      </Route>
      <Route
        path="/project/:projectId"
        element={
          <Suspense fallback={'loading'}>
            <LazyEditor />
          </Suspense>
        }
      />
      <Route path='/project/:projectId/dashboard' element={<Dashboard />}>
        <Route path='setting' element={<Setting />}/>
        <Route path='analysis' element={<Analysis />}>
          <Route path='plugin' element={<ProjectPlugin />}/>
          <Route path='plugin/:pluginId' element={<PluginConfig />}/>
          <Route path='plugin-market' element={<PluginMarket />}/>
          <Route path='heatmap' element={<Heatmap />}/>
          <Route index element={<BasicAnalysis />}/>
        </Route>
        <Route index element={<Overview />}/>
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="*"
        element={
          <main style={{ padding: '1rem' }}>
            <p>There&apos;s nothing here!</p>
          </main>
        }
      />
    </Routes>
  )
}

export default RootPage

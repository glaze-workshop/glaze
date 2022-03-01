import React, { FC, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Router, Routes } from 'react-router-dom'
import { useAxiosConfig } from '../hooks/axios'
import Folder from './folder'
import Home from './home'
import Login from './login'
import Register from './register'

const LazyEditor = React.lazy(() => import('./editor/index'))

const RootPage: FC = () => {
  useAxiosConfig()

  return (
    <Routes>
      <Route path='/' element={<Home/>}>
        <Route path='folder/:folderId' element={<Folder />}/>
      </Route>
      <Route path='/editor' element={
        <Suspense fallback={'loading'}>
          <LazyEditor />
        </Suspense>
        }/>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route
        path="*"
        element={
          <main style={{ padding: '1rem' }}>
            <p>There's nothing here!</p>
          </main>
        }
      />
    </Routes>
  )
}

export default RootPage

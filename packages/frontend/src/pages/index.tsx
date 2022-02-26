import React, { FC, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Router, Routes } from 'react-router-dom'
import Home from './home'
import Login from './login'
import Register from './register'

const LazyEditor = React.lazy(() => import('./editor/index'))

const RootPage: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/editor' element={
          <Suspense fallback={'loading'}>
            <LazyEditor />
          </Suspense>
        }/>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}

export default RootPage

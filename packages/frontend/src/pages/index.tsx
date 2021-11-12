import React, { FC, Suspense } from 'react'
import { Redirect, Route, Router, Switch } from 'react-router-dom'
import history from '../utils/customHistory'

const LazyEditor = React.lazy(() => import('./editor/index'))

const RootPage: FC = () => {
  return (
    <Router history={history}>
      <Switch>
        <Route exact path='/'>
          <Redirect to='/editor' />
        </Route>
        <Route path='/editor'>
          <Suspense fallback={'loading'}>
            <LazyEditor />
          </Suspense>
        </Route>
      </Switch>
    </Router>
  )
}

export default RootPage

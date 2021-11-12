import React, { FC } from 'react'
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
          <LazyEditor />
        </Route>
      </Switch>
    </Router>
  )
}

export default RootPage

import React, { FC } from 'react'
import { Redirect, Route, Router, Switch } from 'react-router-dom'
import Editor from './editor/index'
import history from '../utils/customHistory'

const RootPage: FC = () => {
  return (
    <Router history={history}>
      <Switch>
        <Route exact path='/'>
          <Redirect to='/editor' />
        </Route>
        <Route path='/editor'>
          <Editor />
        </Route>
      </Switch>
    </Router>
  )
}

export default RootPage

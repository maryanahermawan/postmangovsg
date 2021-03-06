import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

// Components
import Landing from 'components/landing'
import Dashboard from 'components/dashboard'
import Error from 'components/error'
import Login from 'components/login'

// Routes HOC
import ProtectedRoute from 'routes/protected.route'

// Contexts
import AuthContextProvider from 'contexts/auth.context'

import './styles/app.scss'

const App = () => {
  return (
    <Router>
      <AuthContextProvider>
        <Switch>
          <Route exact path="/" component={Landing}></Route>
          <Route exact path="/login" component={Login}></Route>
          <ProtectedRoute>
            <Dashboard></Dashboard>
          </ProtectedRoute>
          <Route component={Error} />
        </Switch>
      </AuthContextProvider>
    </Router>
  )
}

export default App

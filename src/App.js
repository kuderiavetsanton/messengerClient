import React from 'react';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom'

import { Container } from 'react-bootstrap'

import { AuthProvider } from './context/auth'
import { MessagesProvider } from './context/messages'

import Register from './pages/Register';
import ApolloProvider from './ApolloProvider'
import Home from './pages/home/Home';
import Login from './pages/Login';
import SmartRoute from './components/SmartRoute'


function App() {
  return (
    <div className="overflow-hidden">
      <ApolloProvider>
        <AuthProvider>
          <MessagesProvider>
            <Router>
              <Container className="pt-5">
                <Switch>
                  <SmartRoute path="/register" component={Register} guest/>
                  <SmartRoute path="/login" component={Login} guest/>
                  <SmartRoute path="/" component={Home} exact authenticated/>
                </Switch>
              </Container>
            </Router>
          </MessagesProvider>
        </AuthProvider>
      </ApolloProvider>    
    </div>
  );
}

export default App;

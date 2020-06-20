import React, { Fragment, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';
import setAuthToken from './utils/setAuthToken';
import { loadUser } from './actions/auth';

//Redux
import { Provider } from 'react-redux';
import store from './store';

//will run everytime the app reloads
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {

  useEffect(() => {
    //call the loaduser directly using the store
    store.dispatch(loadUser());
  }, []);
  
  return (
    <Provider store={ store }>
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path='/' component={ Landing } />
          <section className="container">
            <Alert />
            <Switch>
              <Route exact path='/register' component={ Register } />
              <Route exact path='/login' component={ Login } />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
}

export default App;

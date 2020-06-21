import React, { Fragment, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Dashboard from './components/dashboard/Dashboard';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import CreateProfile from './components/profile-form/CreateProfile';
import EditProfile from './components/profile-form/EditProfile';
import Alert from './components/layout/Alert';
import PrivateRoute from './components/routing/PrivateRoute';
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
              <PrivateRoute exact path='/dashboard' component={ Dashboard } />
              <PrivateRoute exact path='/create-profile' component={ CreateProfile } />
              <PrivateRoute exact path='/edit-profile' component={ EditProfile } />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
}

export default App;

import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import firebase from './configs/firebase';
import './App.css';
import Login from './Pages/Login';
import {
  Button,
  Classes,
  Navbar,
  NavbarGroup,
  NavbarHeading,
  NavbarDivider,
  Spinner,
  AnchorButton,
} from '@blueprintjs/core';
import axios from 'axios';
import Signup from './Pages/Signup';
import CreateProduct from './Pages/CreateProduct';
import Products from './Pages/Products';
import SingleProduct from './Pages/SingleProduct';
axios.defaults.baseURL = `${process.env.REACT_APP_URL}/api`;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState('');
  firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
      const token = await user.getIdToken();
      axios.defaults.headers['Authorization'] = `Bearer ${token}`;
      setIsLoggedIn(true);
      const { data } = await axios.get('/');
      setUser(data.user.username);
    } else {
      setIsLoggedIn(false);
    }
    setLoading(false);
  });

  const signOut = () => {
    firebase.auth().signOut();
  };

  return (
    <div>
      <Navbar>
        <NavbarGroup>
          <NavbarHeading>Trade It</NavbarHeading>
          <NavbarDivider />
          {isLoggedIn ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <AnchorButton
                  href='/'
                  className={Classes.MINIMAL}
                  icon='home'
                  text='Home'
                />
                <AnchorButton
                  href='/add-product'
                  className={Classes.MINIMAL}
                  icon='add'
                  text='Add product'
                />
              </div>
              <NavbarDivider />
              <div>
                <Button
                  className={Classes.MINIMAL}
                  icon='user'
                  text={`Welcome, ${user}`}
                />
                <Button
                  className={Classes.MINIMAL}
                  icon='log-out'
                  text='Sign Out'
                  onClick={signOut}
                />
              </div>
            </div>
          ) : (
            <div>
              <AnchorButton
                href='/'
                className={Classes.MINIMAL}
                icon='log-in'
                text='Login'
              />
              <AnchorButton
                href='/create'
                className={Classes.MINIMAL}
                icon='user'
                text='Signup'
              />
            </div>
          )}
        </NavbarGroup>
      </Navbar>
      <Router>
        {loading ? (
          <div style={{ margin: '20px' }}>
            <Spinner intent='success' />
          </div>
        ) : !isLoggedIn ? (
          <div>
            <Switch>
              <Route exact path='/'>
                <Login />
              </Route>
              <Route path='/create'>
                <Signup />
              </Route>
            </Switch>
          </div>
        ) : (
          <Switch>
            <Route exact path='/'>
              <Products />
            </Route>
            <Route exact path='/add-product'>
              <CreateProduct />
            </Route>
            <Route exact path='/product/:productId'>
              <SingleProduct />
            </Route>
          </Switch>
        )}
      </Router>
    </div>
  );
}

export default App;

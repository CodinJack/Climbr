import React, { useEffect } from 'react';
import GlobalStyles from './utils/GlobalStyles';
import NavBar from './Components/NavBar';
import Register from './Components/Register';
import Login from './Components/Login';
import Messenger from './containers/Messenger';
import LandingPage from './containers/LandingPage';
import AuthRoute from './Components/Auth';
import Container from './Components/Container';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import checkAuth from './utils/checkAuth';
import store from './store/store';

const App = () => {
  useEffect(() => {
    checkAuth(store);
  }, []);

  return (
    <Router>
      <GlobalStyles />
      <NavBar />
      <Container>
        <Route exact path='/' component={LandingPage} />
        <Route path='/register' component={Register} />
        <Route path='/login' component={Login} />
        <AuthRoute path='/messenger' component={Messenger} />
      </Container>
    </Router>
  );
};

export default App;
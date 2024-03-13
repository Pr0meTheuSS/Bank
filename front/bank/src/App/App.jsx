import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Welcome from '../WelcomePage/Welcome';
import Signin from '../SignIn/Signin';

const App = () => {
  return (
    <Router className='App'>
      <Routes>
        <Route path="/login" Component={Welcome} />
        <Route path="/signin" Component={Signin} />
      </Routes>
    </Router>
  );
};

export default App;

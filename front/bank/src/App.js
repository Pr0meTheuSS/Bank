import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Welcome from './Welcome';

const App = () => {
  return (
    <Router className='App'>
      <Routes>
        <Route path="/" Component={Welcome} />
      </Routes>
    </Router>
  );
};

export default App;

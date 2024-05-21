import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Welcome from '../WelcomePage/Welcome';
import Signin from '../SignIn/Signin';
import CustomAppBar from '../AppBar/AppBar';
import EditUserModal from '../UserFormModal/EditUserModal';
import Users from '../Users/Users';
import CreditsPage from '../Credits/Credits';
import{ApolloClient, InMemoryCache, ApolloProvider} from '@apollo/client';

const App = () => {

// Создаем экземпляр клиента Apollo
const client = new ApolloClient({
  uri: 'http://localhost:9091', // Замените на адрес вашего GraphQL-сервера
  cache: new InMemoryCache()
});  
return (
    <ApolloProvider client={client}>
      <Router className='App'>
        <Routes>
          <Route path="/" Component={CustomAppBar} />
          <Route path="/edit-user" Component={EditUserModal} />
          <Route path="/users" Component={Users} />
          <Route path="/credits" Component={CreditsPage} />
          <Route path="/login" Component={Welcome} />
          <Route path="/signin" Component={Signin} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
};

export default App;

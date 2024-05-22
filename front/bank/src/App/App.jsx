import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Welcome from '../WelcomePage/Welcome';
import Signin from '../SignIn/Signin';
import CustomAppBar from '../AppBar/AppBar';
import EditUserModal from '../UserFormModal/EditUserModal';
import Users from '../Users/Users';
import TariffsPage from '../Tariffs/Tariffs';
import CreditsPage from '../Credits/Credits';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
const App = () => {

  const httpLink = createHttpLink({
    uri: 'http://localhost:9091',
  });
  
  // Создайте middleware для добавления заголовка авторизации
  const authLink = setContext((_, { headers }) => {
    // Получите токен авторизации из хранилища (например, localStorage)
    const token = localStorage.getItem('token');
  
    // Возвращаем новые заголовки
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      }
    };
  });
  
  // Объедините authLink и httpLink
  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
  
  return (
    <ApolloProvider client={client}>
      <Router className='App'>
        <Routes>
          <Route path="/" Component={CustomAppBar} />
          <Route path="/edit-user" Component={EditUserModal} />
          <Route path="/users" Component={Users} />
          <Route path="/credits" Component={CreditsPage} />

          <Route path="/credit-tariffs" Component={TariffsPage} />
          <Route path="/login" Component={Welcome} />
          <Route path="/signin" Component={Signin} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
};

export default App;

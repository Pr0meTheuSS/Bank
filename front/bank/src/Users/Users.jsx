import React, { useState } from 'react';
import { Container, Typography, Button, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';
import { useQuery, useMutation } from '@apollo/client';
import CreateUserModal from '../UserFormModal/CreateUserModal';
import EditUserModal from '../UserFormModal/EditUserModal';
import GET_USERS from './quieries';
import { CREATE_USER, UPDATE_USER, DELETE_USER } from './mutations';
import CustomAppBar from '../AppBar/AppBar';

const UsersPage = () => {
  const { loading, error, data } = useQuery(GET_USERS);
  const [deleteUser] = useMutation(DELETE_USER, {
    refetchQueries: [{ query: GET_USERS }],
  });
  const [updateUser] = useMutation(UPDATE_USER, {
    refetchQueries: [{ query: GET_USERS }],
  });
  const [createUser] = useMutation(CREATE_USER, {
    refetchQueries: [{ query: GET_USERS }],
  });

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isNewUserModalOpen, setNewUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState({});

  const onUpdateUser = (updatingUser) => {
    updateUser({ variables: { input: updatingUser } })
      .catch((error) => {
        console.error('Error updating user:', error);
      });
    console.log('Form submitted:', updatingUser);
  }

  const onCreateUser = (createdUser) => {
    createUser({ variables: { input: createdUser } })
      .then(response => {
        console.log('User created:', response.data);
      })
      .catch(error => {
        console.error('Error creating user:', error);
      });
  };

  const handleDeleteUser = (userID) => {
    deleteUser({ variables: { userID: userID } })
      .catch((error) => {
        console.error('Error deleting user:', error);
      });
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setEditModalOpen(true);
    setNewUserModalOpen(false);
  };

  const handleNewUser = () => {
    setEditingUser({});
    setNewUserModalOpen(true);
    setEditModalOpen(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <CustomAppBar />
      <Container>
        <Typography variant="h4">Пользователи</Typography>
        <Button variant="contained" color="primary" onClick={handleNewUser}>Создать пользователя</Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Имя</TableCell>
                <TableCell>Отчество</TableCell>
                <TableCell>Фамилия</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Пароль</TableCell>
                <TableCell>Паспортные данные</TableCell>
                <TableCell>Дата рождения</TableCell>
                <TableCell>Пол</TableCell>
                <TableCell>Роль</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Заблокирован</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.GetUsers.map((user) => (
                <TableRow key={user.ID}>
                  <TableCell>{user.ID}</TableCell>
                  <TableCell>{user.first_name}</TableCell>
                  <TableCell>{user.second_name}</TableCell>
                  <TableCell>{user.last_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.password}</TableCell>
                  <TableCell>{user.passport_data}</TableCell>
                  <TableCell>{user.birth_date}</TableCell>
                  <TableCell>{user.gender}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.status}</TableCell>
                  <TableCell>{user.is_blocked ? 'Да' : 'Нет'}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleEditUser(user)} color="primary">Редактировать</Button>
                    <Button onClick={() => handleDeleteUser(user.ID)} color="secondary">Удалить</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <EditUserModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          user={editingUser}
          onUpdateUser={onUpdateUser}
        />
        <CreateUserModal
          open={isNewUserModalOpen}
          onClose={() => setNewUserModalOpen(false)}
          onCreateUser={onCreateUser}
          user={{}}
        />
      </Container>
    </>
  );
}

export default UsersPage;

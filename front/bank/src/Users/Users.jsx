import React, { useState, useRef } from 'react';
import { Container, Typography, Button, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';
import { useQuery, useMutation } from '@apollo/client';
import CreateUserModal from '../UserFormModal/CreateUserModal';
import EditUserModal from '../UserFormModal/EditUserModal';
import UserCreditsModal from './UserCreditsModal'; // Новый компонент
import GET_USERS from './queries';
import { CREATE_USER, UPDATE_USER, DELETE_USER } from './mutations';
import CustomAppBar from '../AppBar/AppBar';
import UserFilters from './UserFilters';

const UsersPage = () => {
  const pageUsersLimit = 10;
  const [pageUsersOffset, setPageUsersOffset] = useState(0);
  const [filters, setFilters] = useState({});
  const [selectedUserID, setSelectedUserID] = useState(null); // Новый state для ID выбранного пользователя
  const [creditsModalOpen, setCreditsModalOpen] = useState(false); // Новый state для управления модальным окном кредитов

  const { loading, error, data, refetch } = useQuery(GET_USERS, {
    variables: { limit: pageUsersLimit, offset: pageUsersOffset, filters: filters }
  });

  const [deleteUser] = useMutation(DELETE_USER, {
    refetchQueries: [{ query: GET_USERS, variables: { limit: pageUsersLimit, offset: pageUsersOffset, filters: filters } }],
  });
  const [updateUser] = useMutation(UPDATE_USER, {
    refetchQueries: [{ query: GET_USERS, variables: { limit: pageUsersLimit, offset: pageUsersOffset, filters: filters } }],
  });
  const [createUser] = useMutation(CREATE_USER, {
    refetchQueries: [{ query: GET_USERS, variables: { limit: pageUsersLimit, offset: pageUsersOffset, filters: filters } }],
  });

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isNewUserModalOpen, setNewUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState({});
  
  const clickedButtonRef = useRef(null);

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

  const handleRowClick = (userID) => {
    if (!clickedButtonRef.current) {
      setSelectedUserID(userID);
      setCreditsModalOpen(true);
    }
    clickedButtonRef.current = null; // Сбросим ссылку после выполнения
  };

  const handleButtonClick = (ref) => {
    clickedButtonRef.current = ref;
  };

  const handleNextPage = () => {
    setPageUsersOffset(pageUsersOffset + pageUsersLimit);
  };

  const handlePreviousPage = () => {
    if (pageUsersOffset > 0) {
      setPageUsersOffset(pageUsersOffset - pageUsersLimit);
    }
  };

  const applyFilters = () => {
    setPageUsersOffset(0);
    refetch();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <CustomAppBar />
      <Container>
        <Typography variant="h4">Пользователи</Typography>
        <Button variant="contained" color="primary" onClick={handleNewUser}>Создать пользователя</Button>
        <UserFilters onSetFilters={setFilters} applyFilters={applyFilters} />
        <TableContainer sx={{ minWidth: '75vw' }} component={Paper}>
          <Table sx={{ minWidth: '80vw' }}>
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
              {data.GetUsers && data.GetUsers.map((user) => (
                <TableRow key={user.ID} onClick={() => handleRowClick(user.ID)} style={{ cursor: 'pointer' }}>
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
                    <Button onClick={() => { handleButtonClick('edit'); handleEditUser(user); }} color="primary">Редактировать</Button>
                    <Button onClick={() => { handleButtonClick('delete'); handleDeleteUser(user.ID); }} color="secondary">Удалить</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="contained" color="primary" onClick={handlePreviousPage} disabled={pageUsersOffset === 0}>Назад</Button>
          <Button variant="contained" color="primary" onClick={handleNextPage} disabled={data.GetUsers && data.GetUsers.length < pageUsersLimit }>Вперед</Button>
        </div>
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
        <UserCreditsModal
          open={creditsModalOpen}
          onClose={() => setCreditsModalOpen(false)}
          userID={selectedUserID}
        />
      </Container>
    </>
  );
}

export default UsersPage;

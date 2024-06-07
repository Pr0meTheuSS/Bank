import React, { useState, useRef } from 'react';
import { Container, Typography, Button, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';
import { useQuery, useMutation, gql } from '@apollo/client';

import CreateTariffModal from './CreateTariffModal';
import ApplyForCreditModal from './ApplyForCreditModal'; // Импортируем модальное окно для подачи заявки
import CustomAppBar from '../AppBar/AppBar';
import TariffFilters from './TariffFilters'; // Импортируем компонент фильтров

const GET_TARIFFS = gql`
  query GetCreditTariffs($limit: Int, $offset: Int, $filters: TariffFiltersInput) {
    GetCreditTariffs(limit: $limit, offset: $offset, filters: $filters) {
      id
      name
      minAmount
      maxAmount
      minInterestRate
      maxInterestRate
      paymentType
      minTermMonth
      maxTermMonth
      description
    }
  }
`;

export const CREATE_TARIFF = gql`
  mutation createCreditTariff($input: CreditTariffInput!) {
    createCreditTariff(input: $input) {
      status
    }
  }
`;

const DELETE_TARIFF = gql`
  mutation deleteCreditTariff($id: Int!) {
    deleteCreditTariff(id: $id) {
      status
    }
  }
`;

const TariffsPage = () => {
  const pageTariffsLimit = 10;
  const [pageTariffsOffset, setPageTariffsOffset] = useState(0);
  const [filters, setFilters] = useState({});
  const [selectedTariff, setSelectedTariff] = useState(null); // Состояние для выбранного тарифа
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isNewTariffModalOpen, setNewTariffModalOpen] = useState(false);

  const { loading, error, data, refetch } = useQuery(GET_TARIFFS, {
    variables: { limit: pageTariffsLimit, offset: pageTariffsOffset, filters: filters },
  });

  const [deleteTariff] = useMutation(DELETE_TARIFF, {
    refetchQueries: [{ query: GET_TARIFFS, variables: { limit: pageTariffsLimit, offset: pageTariffsOffset, filters: filters } }],
  });

  const [createTariff] = useMutation(CREATE_TARIFF, {
    refetchQueries: [{ query: GET_TARIFFS, variables: { limit: pageTariffsLimit, offset: pageTariffsOffset, filters: filters } }],
  });
  const clickedButtonRef = useRef(null);

  const [editingTariff, setEditingTariff] = useState({});

  const onUpdateTariff = (updatingTariff) => {
    // updateTariff({ variables: { id: updatingTariff.id, input: updatingTariff } })
    //     .catch((error) => {
    //         console.error('Error updating tariff:', error);
    //     });
  };

  const onCreateTariff = (createdTariff) => {
    createTariff({ variables: { input: createdTariff } })
      .then(response => {
        console.log('Tariff created:', response.data);
      })
      .catch(error => {
        console.log(createdTariff);
        console.error('Error creating tariff:', error);
      });
  };

  const handleDeleteTariff = (tariffID) => {
    deleteTariff({ variables: { id: tariffID } })
      .catch((error) => {
        console.error('Error deleting tariff:', error);
      });
  };

  const handleEditTariff = (tariff) => {
    setEditingTariff(tariff);
    setEditModalOpen(true);
    setNewTariffModalOpen(false);
  };

  const handleNewTariff = () => {
    setEditingTariff({});
    setNewTariffModalOpen(true);
    setEditModalOpen(false);
  };

  const handleRowClick = (tariff) => {
    if (!clickedButtonRef.current) {
      setSelectedTariff(tariff);
      setApplyModalOpen(true);
    }
    clickedButtonRef.current = null; // Сбросим ссылку после выполнения

  };

  const handleNextPage = () => {
    setPageTariffsOffset(pageTariffsOffset + pageTariffsLimit);
  };

  const handlePreviousPage = () => {
    if (pageTariffsOffset > 0) {
      setPageTariffsOffset(pageTariffsOffset - pageTariffsLimit);
    }
  };

  const applyFilters = () => {
    setPageTariffsOffset(0);
    refetch();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  console.log(data);
  return (
    <>
      <CustomAppBar />
      <Container>
        <Typography variant="h4">Кредитные Тарифы</Typography>
        <Button variant="contained" color="primary" onClick={handleNewTariff}>Создать Тариф</Button>
        <TariffFilters onSetFilters={setFilters} applyFilters={applyFilters} /> {/* Компонент фильтров */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Название</TableCell>
                <TableCell>Мин. Сумма</TableCell>
                <TableCell>Макс. Сумма</TableCell>
                <TableCell>Мин. Ставка</TableCell>
                <TableCell>Макс. Ставка</TableCell>
                <TableCell>Тип Платежа</TableCell>
                <TableCell>Мин. Срок (мес.)</TableCell>
                <TableCell>Макс. Срок (мес.)</TableCell>
                <TableCell>Описание</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.GetCreditTariffs && data.GetCreditTariffs.map((tariff) => (
                <TableRow key={tariff.id} onClick={() => handleRowClick(tariff)} style={{ cursor: 'pointer' }}>
                  <TableCell>{tariff.id}</TableCell>
                  <TableCell>{tariff.name}</TableCell>
                  <TableCell>{tariff.minAmount}</TableCell>
                  <TableCell>{tariff.maxAmount}</TableCell>
                  <TableCell>{tariff.minInterestRate}</TableCell>
                  <TableCell>{tariff.maxInterestRate}</TableCell>
                  <TableCell>{tariff.paymentType}</TableCell>
                  <TableCell>{tariff.minTermMonth}</TableCell>
                  <TableCell>{tariff.maxTermMonth}</TableCell>
                  <TableCell>{tariff.description}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleEditTariff(tariff)} color="primary">Редактировать</Button>
                    <Button onClick={() => handleDeleteTariff(tariff.id)} color="secondary">Удалить</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="contained" color="primary" onClick={handlePreviousPage} disabled={pageTariffsOffset === 0}>Назад</Button>
          <Button variant="contained" color="primary" onClick={handleNextPage} disabled={data.GetCreditTariffs && data.GetCreditTariffs.length < pageTariffsLimit}>Вперед</Button>
        </div>
        <CreateTariffModal
          open={isNewTariffModalOpen}
          onClose={() => setNewTariffModalOpen(false)}
          onCreateTariff={onCreateTariff}
          tariff={{}}
        />
        {selectedTariff && (
          <ApplyForCreditModal
            open={applyModalOpen}
            onClose={() => setApplyModalOpen(false)}
            tariff={selectedTariff}
          />
        )}
      </Container>
    </>
  );
}

export default TariffsPage;

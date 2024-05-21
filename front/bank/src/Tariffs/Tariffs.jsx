import React, { useState } from 'react';
import { Container, Typography, Button, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';
import { useQuery, useMutation, gql } from '@apollo/client';

import CreateTariffModal from './CreateTariffModal';
// import EditTariffModal from '../TariffFormModal/EditTariffModal';
import CustomAppBar from '../AppBar/AppBar';

const GET_TARIFFS = gql`
  query GetCreditTariffs($limit: Int, $offset: Int) {
    GetCreditTariffs(limit: $limit, offset: $offset) {
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
    const { loading, error, data } = useQuery(GET_TARIFFS, {
        variables: { limit: 10, offset: 0 },
    });

    const [deleteTariff] = useMutation(DELETE_TARIFF, {
        refetchQueries: [{ query: GET_TARIFFS, variables: { limit: 10, offset: 0 } }],
    });
    // const [updateTariff] = useMutation(UPDATE_TARIFF, {
    //     refetchQueries: [{ query: GET_TARIFFS, variables: { limit: 10, offset: 0 } }],
    // });
    const [createTariff] = useMutation(CREATE_TARIFF, {
        refetchQueries: [{ query: GET_TARIFFS, variables: { limit: 10, offset: 0 } }],
    });

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [isNewTariffModalOpen, setNewTariffModalOpen] = useState(false);
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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    console.log(data);
    return (
        <>
            <CustomAppBar />
            <Container>
                <Typography variant="h4">Кредитные Тарифы</Typography>
                <Button variant="contained" color="primary" onClick={handleNewTariff}>Создать Тариф</Button>
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
                            {data.GetCreditTariffs.map((tariff) => (
                                <TableRow key={tariff.id}>
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
                {/* <EditTariffModal
                    open={editModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    tariff={editingTariff}
                    onUpdateTariff={onUpdateTariff}
                />*/
                    <CreateTariffModal
                        open={isNewTariffModalOpen}
                        onClose={() => setNewTariffModalOpen(false)}
                        onCreateTariff={onCreateTariff}
                        tariff={{}}
                    />}
            </Container>
        </>
    );
}

export default TariffsPage;

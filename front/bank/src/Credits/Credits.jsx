import React, { useState, useEffect } from 'react';
import { Container, MenuItem, Typography, Button, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper, TextField } from '@mui/material';
import { useQuery, useMutation } from '@apollo/client';
import CreateCreditModal from '../CreditModal/CreateCreditModal';
import EditCreditModal from '../CreditModal/UpdateCreditModal';
import CustomAppBar from '../AppBar/AppBar';
import { CREATE_CREDIT, UPDATE_CREDIT, DELETE_CREDIT } from './mutations';
import { GET_CREDITS } from './queries';
import { format } from 'date-fns';

const CreditsPage = () => {
    const pageCreditsLimit = 10;
    const [pageCreditsOffset, setPageCreditsOffset] = useState(0);
    const [filters, setFilters] = useState({});

    const [isNewCreditModalOpen, setNewCreditModalOpen] = useState(false);
    const [isEditCreditModalOpen, setEditCreditModalOpen] = useState(false);
    const [selectedCredit, setSelectedCredit] = useState({});

    const [createCreditMutation] = useMutation(CREATE_CREDIT, {
        refetchQueries: [{ query: GET_CREDITS, variables: { limit: pageCreditsLimit, offset: pageCreditsOffset, filters } }],
    });

    const [updateCreditMutation] = useMutation(UPDATE_CREDIT, {
        refetchQueries: [{ query: GET_CREDITS, variables: { limit: pageCreditsLimit, offset: pageCreditsOffset, filters } }],
    });

    const [deleteCreditMutation] = useMutation(DELETE_CREDIT, {
        refetchQueries: [{ query: GET_CREDITS, variables: { limit: pageCreditsLimit, offset: pageCreditsOffset, filters } }],
    });

    const createCredit = () => {
        setNewCreditModalOpen(true);
    }

    const editCredit = (credit) => {
        setSelectedCredit(credit);
        setEditCreditModalOpen(true);
    }

    useEffect(() => {
        setFilters({
            ...filters,
        });
    }, [filters]);

    const deleteCredit = (creditID) => {
        deleteCreditMutation({ variables: { creditID } })
            .then(response => {
                if (response.data.deleteCredit.success) {
                    console.log("Кредит успешно удален");
                } else {
                    console.error("Ошибка при удалении кредита");
                }
            })
            .catch(error => {
                console.error("Ошибка при удалении кредита:", error);
            });
    }

    const onCreateCredit = (credit) => {
        console.log(credit);
        createCreditMutation({ variables: { input: credit } })
            .then(response => {
                if (response.data.createCredit.success) {
                    setNewCreditModalOpen(false);
                } else {
                    console.error("Ошибка при создании кредита");
                }
            })
            .catch(error => {
                console.error("Ошибка при создании кредита:", error);
            });
    }

    const onUpdateCredit = (credit) => {
        const formattedStartDate = format(new Date(credit.startDate), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        const formattedEndDate = format(new Date(credit.endDate), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        console.log(credit);

        const updatedCredit = {
            ...credit,
            startDate: formattedStartDate,
            endDate: formattedEndDate
        };

        updateCreditMutation({ variables: { input: updatedCredit } })
            .then(response => {
                if (response.data.updateCredit.success) {
                    setEditCreditModalOpen(false);
                } else {
                    console.error("Ошибка при обновлении кредита");
                }
            })
            .catch(error => {
                console.error("Ошибка при обновлении кредита:", error);
            });
    }

    const { loading, error, data } = useQuery(GET_CREDITS, {
        variables: { limit: pageCreditsLimit, offset: pageCreditsOffset, filters }
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => {
            if (value === '') {
                const { [name]: _, ...rest } = prevFilters;
                return rest;
            }
            return {
                ...prevFilters,
                [name]: value
            };
        });
    };

    const applyFilters = () => {
        setPageCreditsOffset(0);
    };

    const handleNextPage = () => {
        setPageCreditsOffset(pageCreditsOffset + pageCreditsLimit);
    };

    const handlePreviousPage = () => {
        if (pageCreditsOffset > 0) {
            setPageCreditsOffset(pageCreditsOffset - pageCreditsLimit);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <>
            <CustomAppBar />
            <Container>
                <Typography variant="h4" style={{ color: 'white' }}>Кредиты</Typography>
                <Button variant="contained" color="primary" onClick={createCredit} style={{ marginBottom: '10px' }}>Добавить кредит</Button>
                
                <Paper style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', color: 'white' }}>
                    <TextField
                        label="ID пользователя"
                        name="userID"
                        value={filters.userID}
                        onChange={handleFilterChange}
                        style={{ marginBottom: '10px' }}
                    />
                    <TextField
                        label="Активен"
                        name="isActive"
                        value={filters.isActive}
                        onChange={handleFilterChange}
                        style={{ marginBottom: '10px' }}
                        select
                    >
                        <MenuItem value="">Все</MenuItem>
                        <MenuItem value={true}>Да</MenuItem>
                        <MenuItem value={false}>Нет</MenuItem>
                    </TextField>
                    <TextField
                        label="Минимальная сумма"
                        name="minAmount"
                        value={filters.minAmount}
                        onChange={handleFilterChange}
                        type="number"
                        style={{ marginBottom: '10px' }}
                    />
                    <TextField
                        label="Максимальная сумма"
                        name="maxAmount"
                        value={filters.maxAmount}
                        onChange={handleFilterChange}
                        type="number"
                        style={{ marginBottom: '10px' }}
                    />
                    <TextField
                        label="Дата начала"
                        name="startDate"
                        value={filters.startDate}
                        onChange={handleFilterChange}
                        type="date"
                        style={{ marginBottom: '10px' }}
                    />
                    <TextField
                        label="Дата окончания"
                        name="endDate"
                        value={filters.endDate}
                        onChange={handleFilterChange}
                        type="date"
                        style={{ marginBottom: '10px' }}
                    />
                    <Button variant="contained" color="primary" onClick={applyFilters}>Применить фильтры</Button>
                </Paper>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>ID пользователя</TableCell>
                                <TableCell>ID кредитной заявки</TableCell>
                                <TableCell>Сумма (руб.)</TableCell>
                                <TableCell>Проценты (руб.)</TableCell>
                                <TableCell>Штрафы (руб.)</TableCell>
                                <TableCell>Комиссия (руб.)</TableCell>
                                <TableCell>Активен</TableCell>
                                <TableCell>Тип платежа</TableCell>
                                <TableCell>Процентная ставка</TableCell>
                                <TableCell>Срок кредита (месяцы)</TableCell>
                                <TableCell>Дата начала</TableCell>
                                <TableCell>Дата окончания</TableCell>
                                <TableCell>Действия</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.getCredits.map((credit) => (
                                <TableRow key={credit.id}>
                                    <TableCell>{credit.id}</TableCell>
                                    <TableCell>{credit.userID}</TableCell>
                                    <TableCell>{credit.applicationID}</TableCell>
                                    <TableCell>{credit.body} ₽</TableCell>
                                    <TableCell>{credit.percents} ₽</TableCell>
                                    <TableCell>{credit.fine} ₽</TableCell>
                                    <TableCell>{credit.commission} ₽</TableCell>
                                    <TableCell>{credit.isActive ? 'Да' : 'Нет'}</TableCell>
                                    <TableCell>{credit.paymentType}</TableCell>
                                    <TableCell>{credit.interestRate}</TableCell>
                                    <TableCell>{credit.loanTermMonths}</TableCell>
                                    <TableCell>{credit.startDate}</TableCell>
                                    <TableCell>{credit.endDate}</TableCell>
                                    <TableCell>
                                        <Button variant="outlined" color="primary" size="small" onClick={() => editCredit(credit)}>Редактировать</Button>
                                        <Button variant="outlined" color="secondary" size="small" onClick={() => deleteCredit(credit.id)}>Удалить</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="contained" color="primary" onClick={handlePreviousPage} disabled={pageCreditsOffset === 0}>Назад</Button>
                    <Button variant="contained" color="primary" onClick={handleNextPage}>Вперед</Button>
                </div>
                <CreateCreditModal
                    open={isNewCreditModalOpen}
                    onClose={() => setNewCreditModalOpen(false)}
                    onCreateCredit={onCreateCredit}
                    credit={{}}
                />
                <EditCreditModal
                    open={isEditCreditModalOpen}
                    onClose={() => setEditCreditModalOpen(false)}
                    onUpdateCredit={onUpdateCredit}
                    credit={selectedCredit}
                />
            </Container>
        </>
    );
}

export default CreditsPage;

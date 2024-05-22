import React from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Stack, createTheme, ThemeProvider } from '@mui/material';
import { useMutation, gql } from '@apollo/client';
import Header from '../Header/Header';
import InputWrapperWindow from '../InputWrapperWindow/InputWrapperWindow';
import { useNavigate } from 'react-router-dom';

// Создаем тему с необходимыми стилями
const theme = createTheme({
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiInputLabel-root': {
                        color: 'white', // Цвет текста метки
                    },
                    '& .MuiInputBase-input': {
                        color: 'white', // Цвет текста ввода
                    },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: 'white', // Цвет обрамления
                        },
                        '&:hover fieldset': {
                            borderColor: 'white', // Цвет обрамления при наведении
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: 'white', // Цвет обрамления при фокусировке
                        },
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    color: 'white', // Цвет выбранного текста
                    '& .MuiSelect-icon': {
                        color: 'white', // Цвет иконки
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'white', // Цвет обрамления
                    },
                },
            },
        },
    },
});

const REGISTER_USER = gql`
  mutation RegisterUser($registrationRequest: RegistrationRequest!) {
    register(input: $registrationRequest) {
      status
    }
  }
`;

const Signin = () => {
    const { register, handleSubmit, formState: { errors }, getValues } = useForm();
    const [registerUser] = useMutation(REGISTER_USER);
    const navigate = useNavigate();


    const onSubmit = () => {
        const registrationRequest = {
            user_details: {
                first_name: getValues('first_name'),
                second_name: getValues('second_name'),
                last_name: getValues('last_name'),
                email: getValues('email'),
                passport_data: getValues('passport_data'),
                birth_date: getValues('birth_date'),
                gender: getValues('gender'),
                role: getValues('role'),
                password: getValues('password'),
            },
            password: getValues('password'),
        };

        registerUser({ variables: { registrationRequest } })
            .then(response => {
                console.log('Registration response:', response.data);
                alert('Registration response:', response.data);
                // Переход на страницу с сообщением о статусе регистрации
                navigate('/login', { state: { status: response.data.register.status } });
            })
            .catch(error => {
                console.error('Registration error:', error);
                // Обработка ошибки регистрации
            });
    };

    return (
        <ThemeProvider theme={theme}>
            <>
                <Header />
                <InputWrapperWindow>
                    <Stack spacing={2}>
                        <TextField label="Имя" error={errors.userDetails?.first_name} helperText={errors.userDetails?.first_name && "Имя обязательно"} {...register('first_name')} />
                        <TextField label="Фамилия" error={errors.userDetails?.second_name} helperText={errors.userDetails?.second_name && "Фамилия обязательна"} {...register('second_name')} />
                        <TextField label="Отчество" error={errors.userDetails?.last_name} helperText={errors.userDetails?.last_name && "Отчество обязательно"} {...register('last_name')} />
                        <TextField label="Email" error={errors.userDetails?.email} helperText={errors.userDetails?.email && "Email обязателен"} {...register('email')} />
                        <TextField type="password" label="Пароль" error={errors.password} helperText={errors.password && "Пароль обязателен"} {...register('password')} />
                        <TextField type="password" label="Повторите пароль" error={errors.confirmPassword} helperText={errors.confirmPassword && "Подтверждение пароля обязательно"} {...register('confirmPassword')} />
                        <TextField label="Паспортные данные" error={errors.userDetails?.passportData} helperText={errors.userDetails?.passportData && "Паспортные данные обязательны"} {...register('passport_data')} />
                        <TextField type="date" label="Дата рождения" InputLabelProps={{ shrink: true }} error={errors.userDetails?.birth_date} helperText={errors.userDetails?.birth_date && "Дата рождения обязательна"} {...register('birth_date')} />
                        <FormControl error={errors.userDetails?.gender} fullWidth>
                            <InputLabel>Пол</InputLabel>
                            <Select label="Пол" error={errors.userDetails?.gender} {...register('gender')}>
                                <MenuItem value="MALE">Мужской</MenuItem>
                                <MenuItem value="FEMALE">Женский</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl error={errors.userDetails?.role} fullWidth>
                            <InputLabel>Роль</InputLabel>
                            <Select label="Роль" error={errors.userDetails?.role} {...register('role')}>
                                <MenuItem value="ADMIN">Администратор</MenuItem>
                                <MenuItem value="EMPLOYEE">Сотрудник</MenuItem>
                                <MenuItem value="CLIENT">Клиент</MenuItem>
                            </Select>
                        </FormControl>
                        <Button onClick={handleSubmit(onSubmit)} variant="contained">Регистрация</Button>
                    </Stack>
                </InputWrapperWindow>
            </>
        </ThemeProvider>
    );
};

export default Signin;

import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Typography, TextField, Button, CircularProgress, Alert, Container, Paper, Grid } from '@mui/material';
import CustomAppBar from '../AppBar/AppBar';

const EXECUTE_SQL = gql`
  mutation executeQuery($query: String!) {
    executeQuery(query: $query)
  }
`;

const parseData = (data) => {
  // Удаляем слово "map" и квадратные скобки
  const cleanedData = data.replace(/map|\[|\]/g, '');

  // Используем регулярное выражение для парсинга строк формата "ключ:значение"
  const regex = /(\w+:[^ ]+|[^ ]+:[^ ]+(?:\s[^: ]+)+)/g;
  const matches = cleanedData.match(regex);

  const result = {};

  matches.forEach(item => {
    const index = item.indexOf(':');
    const key = item.substring(0, index);
    const value = item.substring(index + 1);
    result[key] = value;
  });

  return result;
};

const AdminQuery = () => {
  const [query, setQuery] = useState('');
  const [executeSQL, { loading, data, error }] = useMutation(EXECUTE_SQL);

  const handleSubmit = (e) => {
    e.preventDefault();
    executeSQL({ variables: { query } });
  };

  return (
    <>
      <CustomAppBar />
      <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Enter SQL query"
            variant="outlined"
            fullWidth
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ marginBottom: '1rem' }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Execute
          </Button>
        </form>
        {loading && <CircularProgress style={{ display: 'block', margin: '1rem auto' }} />}
        {error && <Alert severity="error" style={{ marginTop: '1rem' }}>Error: {error.message}</Alert>}
        {data && (
          <div style={{ marginTop: '1rem' }}>
            <Typography variant="h6">Results</Typography>
            {data.executeQuery.map((row, index) => {
              const parsedRow = parseData(row);
              return (
                <Paper key={index} style={{ padding: '1rem', margin: '1rem 0' }}>
                  {Object.entries(parsedRow).map(([key, value]) => (
                    <Grid container spacing={2} key={key}>
                      <Grid item xs={6}>
                        <Typography variant="body1"><strong>{key}</strong></Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1">{value}</Typography>
                      </Grid>
                    </Grid>
                  ))}
                </Paper>
              );
            })}
          </div>
        )}
      </Container>
    </>
  );
};

export default AdminQuery;

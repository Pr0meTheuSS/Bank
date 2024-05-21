import { gql } from '@apollo/client';

const GET_USERS = gql`
  query GetUsers {
    GetUsers {
      ID
      first_name
      second_name
      last_name
      email
      password
      passport_data
      birth_date
      gender
      role
      status
      is_blocked
    }
  }
`;

export default GET_USERS;
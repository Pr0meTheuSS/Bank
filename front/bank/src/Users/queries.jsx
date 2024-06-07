import { gql } from '@apollo/client';

const GET_USERS = gql`
  query GetUsers($limit: Int, $offset: Int, $filters: UserFilters) {
    GetUsers(limit: $limit, offset: $offset, filters: $filters) {
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
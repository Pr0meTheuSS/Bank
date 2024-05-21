import { gql } from '@apollo/client';

export const DELETE_USER = gql`
  mutation DeleteUser($userID: Int!) {
    deleteUser(userID: $userID) {
      status
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($input: UpdateUserRequest!) {
    updateUser(input: $input) {
      status
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      status
    }
  }
`;


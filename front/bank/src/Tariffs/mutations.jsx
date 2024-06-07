import { gql } from '@apollo/client';

export const CREATE_APPLICATION = gql`
  mutation CreateApplication($createApplication: CreateApplication!) {
    createApplication(createApplication: $createApplication) {
      status
    }
  }
`;

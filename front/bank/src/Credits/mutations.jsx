import { gql } from '@apollo/client';

export const CREATE_CREDIT = gql`
  mutation CreateCredit($input: CreateCreditRequest!) {
    createCredit(input: $input) {
      success
      credit {
        id
        userID
        applicationID
        body
        percents
        fine
        commission
        isActive
        paymentType
        interestRate
        loanTermMonths
        startDate
        endDate
      }
    }
  }
`;

export const UPDATE_CREDIT = gql`
  mutation UpdateCredit($input: UpdateCreditRequest!) {
    updateCredit(input: $input) {
      success
      credit {
        id
        userID
        applicationID
        body
        percents
        fine
        commission
        isActive
        paymentType
        interestRate
        loanTermMonths
        startDate
        endDate
      }
    }
  }
`;


export const DELETE_CREDIT = gql`
  mutation DeleteCredit($creditID: Int!) {
    deleteCredit(creditID: $creditID) {
      success
    }
  }
`;
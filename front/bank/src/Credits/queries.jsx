import { gql } from "@apollo/client";

export const GET_CREDITS = gql`
  query GetCredits($limit: Int, $offset: Int) {
    getCredits(limit: $limit, offset: $offset) {
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
`;

import { gql } from "@apollo/client";

export const GET_CREDITS = gql`
query GetCredits($limit: Int, $offset: Int, $filters: CreditFilters) {
  getCredits(limit: $limit, offset: $offset, filters: $filters) {
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

export default GET_CREDITS;
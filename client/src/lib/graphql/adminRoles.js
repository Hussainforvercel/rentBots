import { gql } from 'react-apollo';

export const deleteAdminReview = gql`
    mutation deleteAdminReview ($reviewId: Int!) {
        deleteAdminReview (reviewId: $reviewId) {
          status
        }
      }
    `;

export const createAdminRoleMutation = gql`mutation ($id: Int, $name: String!, $description: String, $privileges: [Int]!) {
    createAdminRole (id: $id, name: $name, description: $description, privileges: $privileges) {
          status
          errorMessage
      }
    }`;

export const deleteAdminRoleMutation = gql`mutation ($id: Int!) {
    deleteAdminRole(id: $id) {
          status
          errorMessage
      }
    }`;

export const getPrivilegesQuery = gql`query {
    getPrivileges {
          results{
            id
            privilege
            permittedUrls
          }
          status
          errorMessage
      }
    }`;
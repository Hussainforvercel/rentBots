import { gql } from 'react-apollo';

export const createAdminUserMutation = gql`mutation ($id: String, $email: String!, $password: String, $roleId: Int!) {
    createAdminUser (id: $id, email: $email, password: $password, roleId: $roleId) {
        status
        errorMessage
        }
    }`;

export const deleteAdminUserMutation = gql`mutation ($id: String!) {
    deleteAdminUser (id: $id) {
        status
        errorMessage
        }
    }`;

export const getAdminUserQuery = gql`query {
    getAdminUser {
        id
        email
        isSuperAdmin
        roleId
        createdAt
        adminRole {
            id
            privileges
        }
        status
        errorMessage
      }
    }`;

export const getAllAdminUsersQuery = gql`query($currentPage: Int, $searchList: String) {
    getAllAdminUsers(currentPage: $currentPage, searchList: $searchList) {
        count
        status
        errorMessage
        results{
          id
          email
          isSuperAdmin
          roleId
          createdAt
          updatedAt
          adminRole {
            id
            name
            description
            createdAt
            updatedAt
            privileges
          }
        }
      }
    }`;
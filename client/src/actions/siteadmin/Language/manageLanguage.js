import { gql } from 'apollo-boost';
import { toastr } from 'react-redux-toastr';

// GraphQL Queries
const GET_LANGUAGES = gql`
  query getLanguages {
    getLanguages {
      id
      title
      code
      fileURL
    }
  }
`;

const CREATE_LANGUAGE = gql`
  mutation createLanguage($title: String!, $code: String!, $fileURL: String) {
    createLanguage(title: $title, code: $code, fileURL: $fileURL) {
      status
      errorMessage
    }
  }
`;

const UPDATE_LANGUAGE = gql`
  mutation updateLanguage($id: Int!, $title: String!, $code: String!, $fileURL: String) {
    updateLanguage(id: $id, title: $title, code: $code, fileURL: $fileURL) {
      status
      errorMessage
    }
  }
`;

const DELETE_LANGUAGE = gql`
  mutation deleteLanguage($id: Int!) {
    deleteLanguage(id: $id) {
      status
      errorMessage
    }
  }
`;

export function getLanguages() {
    return async (dispatch, getState, { client }) => {
        try {
            const { data } = await client.query({
                query: GET_LANGUAGES,
                fetchPolicy: 'network-only'
            });

            if (data && data.getLanguages) {
                return {
                    status: 200,
                    data: data.getLanguages
                };
            }
        } catch (error) {
            toastr.error('Error!', 'Failed to get languages');
            return {
                status: 400,
                errorMessage: error.message
            };
        }
    };
}

export function createLanguage(title, code, fileURL) {
    return async (dispatch, getState, { client }) => {
        try {
            const { data } = await client.mutate({
                mutation: CREATE_LANGUAGE,
                variables: {
                    title,
                    code,
                    fileURL
                }
            });

            if (data && data.createLanguage) {
                if (data.createLanguage.status === 200) {
                    toastr.success('Success!', 'Language created successfully');
                    return {
                        status: 200
                    };
                } else {
                    toastr.error('Error!', data.createLanguage.errorMessage);
                    return {
                        status: 400,
                        errorMessage: data.createLanguage.errorMessage
                    };
                }
            }
        } catch (error) {
            toastr.error('Error!', 'Failed to create language');
            return {
                status: 400,
                errorMessage: error.message
            };
        }
    };
}

export function updateLanguage(id, title, code, fileURL) {
    return async (dispatch, getState, { client }) => {
        try {
            const { data } = await client.mutate({
                mutation: UPDATE_LANGUAGE,
                variables: {
                    id,
                    title,
                    code,
                    fileURL
                }
            });

            if (data && data.updateLanguage) {
                if (data.updateLanguage.status === 200) {
                    toastr.success('Success!', 'Language updated successfully');
                    return {
                        status: 200
                    };
                } else {
                    toastr.error('Error!', data.updateLanguage.errorMessage);
                    return {
                        status: 400,
                        errorMessage: data.updateLanguage.errorMessage
                    };
                }
            }
        } catch (error) {
            toastr.error('Error!', 'Failed to update language');
            return {
                status: 400,
                errorMessage: error.message
            };
        }
    };
}

export function deleteLanguage(id) {
    return async (dispatch, getState, { client }) => {
        try {
            const { data } = await client.mutate({
                mutation: DELETE_LANGUAGE,
                variables: {
                    id
                }
            });

            if (data && data.deleteLanguage) {
                if (data.deleteLanguage.status === 200) {
                    toastr.success('Success!', 'Language deleted successfully');
                    return {
                        status: 200
                    };
                } else {
                    toastr.error('Error!', data.deleteLanguage.errorMessage);
                    return {
                        status: 400,
                        errorMessage: data.deleteLanguage.errorMessage
                    };
                }
            }
        } catch (error) {
            toastr.error('Error!', 'Failed to delete language');
            return {
                status: 400,
                errorMessage: error.message
            };
        }
    };
} 
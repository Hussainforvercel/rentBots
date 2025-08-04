import {
    CREATE_ADMIN_ROLES_START,
    CREATE_ADMIN_ROLES_SUCCESS,
    CREATE_ADMIN_ROLES_ERROR,
    DELETE_ADMIN_ROLES_START,
    DELETE_ADMIN_ROLES_SUCCESS,
    DELETE_ADMIN_ROLES_ERROR,
    ADMIN_PRIVILEGES_START,
    ADMIN_PRIVILEGES_SUCCESS,
    ADMIN_PRIVILEGES_ERROR
} from '../../../constants';
import query from '../../../components/siteadmin/AdminRolesManagement/adminRolesQuery.graphql';
import { closeAdminRolesModal } from '../modalActions';
import { createAdminRoleMutation, deleteAdminRoleMutation, getPrivilegesQuery } from '../../../lib/graphql';
import showToaster from '../../../helpers/toasterMessages/showToaster';

const createAdminRole = (id, name, description, privileges) => {
    return async (dispatch, getState, { client }) => {

        try {
            await dispatch({
                type: CREATE_ADMIN_ROLES_START,
                payload: {
                    createAdminRoleLoading: true
                }
            });

            const { data } = await client.mutate({
                mutation: createAdminRoleMutation,
                variables: {
                    id,
                    name,
                    description,
                    privileges
                },
                refetchQueries: [{ query }]
            });

            if (data?.createAdminRole?.status === 200) {
                await dispatch({
                    type: CREATE_ADMIN_ROLES_SUCCESS,
                    payload: {
                        createAdminRoleLoading: false
                    }
                });
                dispatch(closeAdminRolesModal());
                showToaster({ messageId: 'addUpdateAdminRole', toasterType: 'success', requestMessage: id })

                return {
                    status: 200
                };
            } else {
                showToaster({ messageId: 'adminRoleError', toasterType: 'error', requestMessage: data && data.createAdminRole && data.createAdminRole.errorMessage })
                dispatch(closeAdminRolesModal());
                await dispatch({
                    type: CREATE_ADMIN_ROLES_ERROR,
                    payload: {
                        createAdminRoleLoading: false,
                        error: data?.createAdminRole?.errorMessage
                    }
                });

                return {
                    status: 400
                };
            }
        } catch (error) {
            dispatch(closeAdminRolesModal());
            await dispatch({
                type: CREATE_ADMIN_ROLES_ERROR,
                payload: {
                    createAdminRoleLoading: false,
                    error
                }
            });
            return {
                status: 400
            };
        }
    }
}

const deleteAdminRole = (id) => {
    return async (dispatch, getState, { client }) => {

        try {
            await dispatch({
                type: DELETE_ADMIN_ROLES_START,
                payload: {
                    deleteAdminRoleLoading: true
                }
            });

            const { data } = await client.mutate({
                mutation: deleteAdminRoleMutation,
                variables: {
                    id
                }
            });

            if (data?.deleteAdminRole?.status === 200) {
                await dispatch({
                    type: DELETE_ADMIN_ROLES_SUCCESS,
                    payload: {
                        deleteAdminRoleLoading: false
                    }
                });
                dispatch(closeAdminRolesModal());
                showToaster({ messageId: 'deleteAdminRole', toasterType: 'success' })
                return {
                    status: 200
                };
            } else {
                showToaster({ messageId: 'adminRoleError', toasterType: 'error', requestMessage: data && data.deleteAdminRole && data.deleteAdminRole.errorMessage })
                await dispatch({
                    type: DELETE_ADMIN_ROLES_ERROR,
                    payload: {
                        deleteAdminRoleLoading: false,
                        error: data?.deleteAdminRole?.errorMessage
                    }
                });
                return {
                    status: 400
                };
            }
        } catch (error) {
            await dispatch({
                type: DELETE_ADMIN_ROLES_ERROR,
                payload: {
                    deleteAdminRoleLoading: false,
                    error
                }
            });
            return {
                status: 400
            };
        }
    }
}

const getPrivileges = () => {
    return async (dispatch, getState, { client }) => {

        try {
            await dispatch({
                type: ADMIN_PRIVILEGES_START
            });

            const { data } = await client.query({
                query: getPrivilegesQuery
            });

            if (data?.getPrivileges?.status === 200) {
                await dispatch({
                    type: ADMIN_PRIVILEGES_SUCCESS,
                    payload: {
                        privileges: data?.getPrivileges?.results
                    }
                });
            } else {
                await dispatch({
                    type: ADMIN_PRIVILEGES_ERROR,
                });
            }
        } catch (error) {
            await dispatch({
                type: ADMIN_PRIVILEGES_ERROR,
            });
        }
    }
}

export { createAdminRole, deleteAdminRole, getPrivileges }; 
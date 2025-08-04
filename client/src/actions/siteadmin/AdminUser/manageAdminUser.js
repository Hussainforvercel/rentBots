import {
    CREATE_ADMIN_USER_START,
    CREATE_ADMIN_USER_SUCCESS,
    CREATE_ADMIN_USER_ERROR,
    DELETE_ADMIN_USER_START,
    DELETE_ADMIN_USER_SUCCESS,
    DELETE_ADMIN_USER_ERROR,
    GET_ADMIN_USER_START,
    GET_ADMIN_USER_SUCCESS,
    GET_ADMIN_USER_ERROR
} from '../../../constants';
import { setRuntimeVariable } from '../../runtime';
import { closeAdminUserModal } from '../modalActions';
import {
    createAdminUserMutation, deleteAdminUserMutation, getAdminUserQuery,
    getPrivilegesQuery, getAllAdminUsersQuery
} from '../../../lib/graphql';
import showToaster from '../../../helpers/toasterMessages/showToaster';

const createAdminUser = (id, email, password, roleId) => {
    return async (dispatch, getState, { client }) => {

        try {
            await dispatch({
                type: CREATE_ADMIN_USER_START,
                payload: {
                    createAdminUserLoading: true
                }
            });

            const { data } = await client.mutate({
                mutation: createAdminUserMutation,
                variables: {
                    id,
                    email,
                    password,
                    roleId
                },
                refetchQueries: [{ query: getAllAdminUsersQuery, variables: { currentPage: 1 } }]
            });

            if (data?.createAdminUser?.status === 200) {
                await dispatch({
                    type: CREATE_ADMIN_USER_SUCCESS,
                    payload: {
                        createAdminUserLoading: false
                    }
                });
                dispatch(closeAdminUserModal());
                showToaster({ messageId: 'addUpdateAdminUser', toasterType: 'success', requestMessage: id })
                return {
                    status: 200
                };
            } else {
                dispatch(closeAdminUserModal());
                showToaster({ messageId: 'adminUserError', toasterType: 'error', requestMessage: data?.createAdminUser?.errorMessage })
                await dispatch({
                    type: CREATE_ADMIN_USER_ERROR,
                    payload: {
                        createAdminUserLoading: false,
                        error: data?.createAdminUser?.errorMessage
                    }
                });
                return {
                    status: 400
                };
            }
        } catch (error) {
            await dispatch({
                type: CREATE_ADMIN_USER_ERROR,
                payload: {
                    createAdminUserLoading: false,
                    error
                }
            });
            return {
                status: 400
            };
        }
    }
}

const deleteAdminUser = (id) => {
    return async (dispatch, getState, { client }) => {

        try {
            await dispatch({
                type: DELETE_ADMIN_USER_START,
                payload: {
                    deleteAdminUserLoading: true
                }
            });

            const { data } = await client.mutate({
                mutation: deleteAdminUserMutation,
                variables: {
                    id
                },
            });

            if (data?.deleteAdminUser?.status === 200) {
                await dispatch({
                    type: DELETE_ADMIN_USER_SUCCESS,
                    payload: {
                        deleteAdminUserLoading: false
                    }
                });
                dispatch(closeAdminUserModal());
                showToaster({ messageId: 'deleteAdminUser', toasterType: 'success' })
                return {
                    status: 200
                };
            } else {
                showToaster({ messageId: 'adminUserError', toasterType: 'error', requestMessage: data?.deleteAdminUser?.errorMessage })
                await dispatch({
                    type: DELETE_ADMIN_USER_ERROR,
                    payload: {
                        deleteAdminUserLoading: false,
                        error: data?.deleteAdminUser?.errorMessage
                    }
                });
                return {
                    status: 400
                };
            }
        } catch (error) {
            await dispatch({
                type: DELETE_ADMIN_USER_ERROR,
                payload: {
                    deleteAdminUserLoading: false,
                    error
                }
            });
            return {
                status: 400
            };
        }
    }
}

const getAdminUser = () => {
    return async (dispatch, getState, { client }) => {
        try {

            let adminPrivileges;
            const privilegesData = await client.query({
                query: getPrivilegesQuery
            });

            let privileges = privilegesData?.data?.getPrivileges && privilegesData?.data?.getPrivileges?.results;
            let defaultPrivileges = privileges?.length > 0 && privileges.map((item) => item.id);

            await dispatch({
                type: GET_ADMIN_USER_START,
                payload: {
                    getAdminUserLoading: true
                }
            });

            const { data } = await client.query({
                query: getAdminUserQuery
            });

            if (data?.getAdminUser?.id) {
                dispatch(setRuntimeVariable({
                    name: 'isSuperAdmin',
                    value: data?.getAdminUser?.isSuperAdmin
                }));

                adminPrivileges = {
                    id: data?.getAdminUser?.id,
                    email: data?.getAdminUser?.email,
                    isSuperAdmin: data?.getAdminUser?.isSuperAdmin,
                    roleId: data?.getAdminUser?.roleId,
                    privileges: (data?.getAdminUser && data?.getAdminUser?.adminRole && data?.getAdminUser?.adminRole?.privileges) || []
                };

                if (adminPrivileges?.isSuperAdmin) {
                    adminPrivileges['privileges'] = defaultPrivileges;
                }

                await dispatch({
                    type: GET_ADMIN_USER_SUCCESS,
                    payload: {
                        getAdminUserLoading: false,
                        adminPrivileges
                    }
                });
                return adminPrivileges;
            } else {
                await dispatch({
                    type: GET_ADMIN_USER_ERROR,
                    payload: {
                        getAdminUserLoading: false,
                        error: data?.getAdminUser?.errorMessage
                    }
                });
                return false;
            }
        } catch (error) {
            await dispatch({
                type: GET_ADMIN_USER_ERROR,
                payload: {
                    getAdminUserLoading: false,
                    error
                }
            });
            return false;
        }
    }
}

export { createAdminUser, deleteAdminUser, getAdminUser }; 
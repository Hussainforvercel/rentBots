import {
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull
} from 'graphql';
import { AdminUser, AdminRoles } from '../../../models';
import AdminUserType from '../../../types/siteadmin/AdminUserType';
import showErrorMessage from '../../../../helpers/showErrorMessage';

const createAdminUser = {
    type: AdminUserType,
    args: {
        id: { type: StringType },
        email: { type: new NonNull(StringType) },
        password: { type: StringType },
        roleId: { type: new NonNull(IntType) }
    },
    async resolve({ request, response }, {
        id,
        email,
        password,
        roleId
    }) {

        try {
            let isAlreadyExist, isValidRoleId;
            if (request?.user && request?.user?.admin) {
                isAlreadyExist = await AdminUser.findOne({
                    attributes: ['id', 'email'],
                    where: {
                        email
                    },
                    raw: true
                });

                isValidRoleId = await AdminRoles.findOne({
                    attributes: ['id'],
                    where: {
                        id: roleId
                    }
                });

                if (!isValidRoleId) {
                    return await {
                        status: 400,
                        errorMessage: await showErrorMessage({ errorCode: 'invalidAdminRole' })
                    };
                }

                if (id) { // Update
                    if (isAlreadyExist && isAlreadyExist?.id != id) {
                        return {
                            status: 400,
                            errorMessage: await showErrorMessage({ errorCode: 'checkEmail' })
                        };
                    } else {
                        const updateUser = await AdminUser.update({
                            email,
                            roleId
                        }, {
                            where: {
                                id
                            }
                        });

                        if (password && password?.toString().trim() != '') {
                            await AdminUser.update({
                                password: AdminUser.generateHash(password)
                            }, {
                                where: {
                                    id
                                }
                            });
                        }

                        return await {
                            status: updateUser ? 200 : 400,
                            errorMessage: updateUser ? null : await showErrorMessage({ errorCode: 'commonError' })
                        }
                    }
                } else { // Create
                    if (isAlreadyExist) {
                        return {
                            status: 400,
                            errorMessage: await showErrorMessage({ errorCode: 'checkEmail' })
                        };
                    } else {
                        const createUser = await AdminUser.create({
                            email,
                            password: AdminUser.generateHash(password),
                            isSuperAdmin: false,
                            roleId
                        });

                        return {
                            status: createUser ? 200 : 400,
                            errorMessage: createUser ? null : await showErrorMessage({ errorCode: 'commonError' })
                        }
                    }
                }
            } else {
                return {
                    status: 500,
                    errorMessage: await showErrorMessage({ errorCode: 'userLoginError' })
                };
            }
        } catch (error) {
            return {
                status: 500,
                errorMessage: await showErrorMessage({ errorCode: 'checkEmail' })
            };
        }
    }
}

export default createAdminUser;

/*

mutation ($id: String, $email: String!, $password: String, $roleId: Int!) {
  createAdminUser (id: $id, email: $email, password: $password, roleId: $roleId) {
    status
    errorMessage
  }
}

*/
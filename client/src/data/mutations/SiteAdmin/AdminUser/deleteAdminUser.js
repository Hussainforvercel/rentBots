import {
    GraphQLString as StringType,
    GraphQLNonNull as NonNull
} from 'graphql';
import { AdminUser } from '../../../models';
import AdminUserType from '../../../types/siteadmin/AdminUserType';
import showErrorMessage from '../../../../helpers/showErrorMessage';

const deleteAdminUser = {
    type: AdminUserType,
    args: {
        id: { type: new NonNull(StringType) }
    },
    async resolve({ request, response }, { id }) {
        try {
            if (request?.user?.admin) {
                await AdminUser.destroy({ where: { id } });
                return await {
                    status: 200
                };
            } else {
                return {
                    status: 500,
                    errorMessage: await showErrorMessage({ errorCode: 'userLoginError' })
                };
            }
        } catch (error) {
            return {
                status: 400,
                errorMessage: error
            }
        }
    }
}

export default deleteAdminUser;

/*

mutation ($id: String!) {
  deleteAdminUser (id: $id) {
    status
    errorMessage
  }
}
 
 

*/
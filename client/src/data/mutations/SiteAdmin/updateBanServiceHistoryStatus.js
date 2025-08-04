import {
    GraphQLString as StringType,
    GraphQLInt as IntType,
} from 'graphql';
import { User, Listing } from '../../../data/models';
import UserManagementType from '../../types/siteadmin/UserManagementType';

const updateBanServiceHistoryStatus = {
    type: UserManagementType,
    args: {
        id: { type: StringType },
        banStatus: { type: IntType }
    },
    async resolve({ request }, {
        id,
        banStatus
    }) {

        try {
            if (request.user && request.user.admin == true) {

                await User.update({
                    userBanStatus: banStatus,
                    // isActive
                }, {
                    where: {
                        id
                    }
                });
                if (banStatus == 1) {
                    await Listing.update({
                        isPublished: 0,
                        // isActive
                    }, {
                        where: {
                            userId: id
                        }
                    });
                }
                return {
                    status: 'success'
                }
            } else {
                return {
                    status: 'failed'
                }
            }
        } catch (error) {
            return {
                status: 400,
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
            };
        }
    },
};

export default updateBanServiceHistoryStatus;

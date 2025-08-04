import {
    GraphQLString as StringType,
    GraphQLInt as IntType,
} from 'graphql';
import { WishListGroup } from '../../models';
import WishListGroupType from '../../types/WishListGroupType';
import showErrorMessage from '../../../helpers/showErrorMessage';

const UpdateWishListGroup = {
    type: WishListGroupType,
    args: {
        name: { type: StringType },
        isPublic: { type: IntType },
        id: { type: IntType }
    },
    async resolve({ request, response }, { name, isPublic, id }) {

        try {
            // Check whether user is logged in
            if (request?.user || request?.user?.admin) {
                const userId = request?.user?.id;
                const updateWishListGroup = await WishListGroup.update({
                    name,
                    isPublic
                }, {
                    where: {
                        id
                    }
                });

                return {
                    status: updateWishListGroup ? "success" : "failed"
                };
            } else {
                return {
                    status: "NotLoggedIn"
                };
            }
        } catch (error) {
            return {
                status: 400,
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
            }
        }
    },
};

export default UpdateWishListGroup;

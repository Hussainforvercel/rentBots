import {
    GraphQLString as StringType,
} from 'graphql';
import { WishListGroup } from '../../models';
import WishListGroupType from '../../types/WishListGroupType';
import showErrorMessage from '../../../helpers/showErrorMessage';

const CreateWishListGroup = {
    type: WishListGroupType,
    args: {
        name: { type: StringType },
        isPublic: { type: StringType }
    },
    async resolve({ request, response }, { name, isPublic }) {

        try {
            // Check whether user is logged in
            if (request?.user || request?.user?.admin) {
                const userId = request?.user?.id;
                const createWishListGroup = await WishListGroup.create({
                    userId,
                    name,
                    isPublic
                });

                return {
                    status: "success",
                    id: createWishListGroup?.id
                };
            } else {
                return {
                    status: "Not loggedIn"
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

export default CreateWishListGroup;
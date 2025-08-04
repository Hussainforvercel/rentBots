import {
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
} from 'graphql';
import { WishList } from '../../models';
import WishListGroupType from '../../types/WishListGroupType';
import showErrorMessage from '../../../helpers/showErrorMessage';

const updateListStatus = {
    type: WishListGroupType,
    args: {
        listId: { type: new NonNull(IntType) },
        action: { type: new NonNull(StringType) }
    },
    async resolve({ request }, { listId, action }) {

        try {
            let publishStatus;
            if (listId && action) {
                if (action === 'unPublish') {
                    publishStatus = false;
                } else {
                    publishStatus = true;
                }
            }

            let updateListingStatus = await WishList.update({
                isListActive: publishStatus
            }, {
                where: {
                    listId
                }
            });

            return {
                status: updateListingStatus ? 200 : 400
            }
        } catch (error) {
            return {
                status: 400,
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
            }
        }
    }
}

export default updateListStatus;
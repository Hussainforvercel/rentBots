import {
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull
} from 'graphql';
import { WishListGroup, UserProfile } from '../../models';
import WishListGroupType from '../../types/WishListGroupType';

const getWishListGroup = {

    type: WishListGroupType,

    args: {
        profileId: { type: new NonNull(IntType) },
        id: { type: new NonNull(IntType) }
    },

    async resolve({ request }, { id, profileId }) {
        if (profileId) {
            const userData = await UserProfile.find({
                attributes: [
                    'userId',
                ],
                where: {
                    profileId
                }
            });

            return await WishListGroup.findOne({
                where: {
                    userId: userData.userId,
                    id
                }
            });

        } else {
            return {
                status: 'noUserId'
            }
        } 
    }
}

export default getWishListGroup;
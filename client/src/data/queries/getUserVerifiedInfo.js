import {
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
} from 'graphql';
import { UserVerifiedInfo } from '../../data/models';
import UserVerifiedInfoType from '../types/UserVerifiedInfoType';

const getUserVerifiedInfo = {

    type: UserVerifiedInfoType,

    args: {
        userId: { type: new NonNull(StringType) },
    },

    async resolve({ request }, { userId }) {

        return await UserVerifiedInfo.findOne({
            where: {
                userId
            }
        });

    }
};

export default getUserVerifiedInfo;
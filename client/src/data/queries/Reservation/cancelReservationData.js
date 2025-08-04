import {
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
} from 'graphql';
import { Reservation } from '../../models';
import ReservationType from '../../types/ReservationType';
import showErrorMessage from '../../../helpers/showErrorMessage';

const cancelReservationData = {

    type: ReservationType,

    args: {
        reservationId: { type: new NonNull(IntType) },
        userType: { type: new NonNull(StringType) },
    },

    async resolve({ request }, { reservationId, userType }) {
        try {
            if (request.user) {
                const id = reservationId;
                const userId = request.user.id;
                let where, checkOutNewDate, reservationState, checkOut;
                reservationState = [{ reservationState: 'pending' }, { reservationState: 'approved' }];

                checkOutNewDate = new Date();
                checkOutNewDate.setHours(0, 0, 0, 0);
                checkOut = { $gte: checkOutNewDate };

                if (userType === 'owner') {
                    where = {
                        id,
                        hostId: userId,
                        $or: reservationState,
                        checkOut
                    };
                } else {
                    where = {
                        id,
                        guestId: userId,
                        $or: reservationState,
                        checkOut
                    };
                }

                return await Reservation.findOne({
                    where
                });
            } else {
                return {
                    status: "notLoggedIn",
                };
            }
        } catch (error) {
            return {
                status: '500',
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
            };
        }
    }
};

export default cancelReservationData;

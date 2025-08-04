import {
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
} from 'graphql';
import { Reservation } from '../../models';
import ReservationType from '../../types/ReservationType';

const updatePayoutForReservation = {
    type: ReservationType,
    args: {
        payoutId: { type: new NonNull(IntType) },
        reservationId: { type: new NonNull(IntType) }
    },
    async resolve({ request }, { mode, payoutId, reservationId }) {

        if (request?.user && !request?.user?.admin) {
            try {
                const hostId = request?.user?.id;

                const change = await Reservation.update({
                    payoutId
                }, {
                    where: {
                        hostId,
                        id: reservationId
                    }
                });

                return {
                    status: change ? 'success' : 'updateFailed'
                }
            } catch (error) {
                return {
                    status: error
                }
            }
        } else {
            return {
                status: 'notLoggedIn',
            };
        }
    }
};

export default updatePayoutForReservation;
import { Reservation } from '../data/models';

const updateReservationData = async ({ id, updateData }) => {
    await Reservation.update(updateData, {
        where: {
            id
        }
    });
}

const getPayoutReservation = async ({ id }) => {
    const reservationCount = await Reservation.count({
        where: {
            id,
            payoutTransactionId: { $ne: null }
        }
    });
    return reservationCount || 0;
}


export {
    updateReservationData,
    getPayoutReservation
}
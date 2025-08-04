import { Reservation } from '../../../data/models';
import ReservationDashboardType from '../../types/siteadmin/ReservationDashboardType';

const getReservationDashboard = {

    type: ReservationDashboardType,

    async resolve({ request }) {
        try {
            const totalCount = await Reservation.count({
                where: {
                    paymentState: 'completed'
                },
            });

            const todayCount = await Reservation.count({
                where: {
                    createdAt: {
                        $lt: new Date(),
                        $gt: new Date(new Date() - 24 * 60 * 60 * 1000)
                    },
                    paymentState: 'completed'
                },
            });

            const monthCount = await Reservation.count({
                where: {
                    createdAt: {
                        $lt: new Date(),
                        $gt: new Date(new Date() - 30 * 24 * 60 * 60 * 1000)
                    },
                    paymentState: 'completed'
                },
            });

            return {
                totalCount,
                todayCount,
                monthCount
            };
        } catch (error) {
            return {
                status: '500'
            };
        }
    },
};

export default getReservationDashboard;
import {
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull
} from 'graphql';
import { Reservation } from '../models';
import ReservationType from '../types/ReservationType';

const getUpcomingBookings = {


    type: ReservationType,


    args: {
        listId: { type: new NonNull(IntType) },
    },


    async resolve({ request }, { listId }) {


        if (request.user) {
            const userId = request.user.id;
            let where, date = new Date();
            let checkIn = { $gt: date };
            let instantBook = 'intantBooking';

            const getReservation = await Reservation.count({
                where: {
                    listId,
                    paymentState: 'completed',
                    $or: [
                        {

                            reservationState: 'approved'
                        },
                        {
                            reservationState: 'pending'
                        }
                    ],
                },
            });


            // const getThreads = await Threads.findOne({
            //     where: {
            //         listId,
            //         $or: [
            //             {
            //                 guest: userId
            //             },
            //             {
            //                 host: userId
            //             }
            //         ],
            //     },
            // });

            // const getThreadItemsData = await ThreadItems.count({
            //     where: {
            //         //sentBy: userId,
            //         threadId: getThreads.id,
            //         //type: 'preApproved',
            //         $and: [
            //             {
            //                 type: {
            //                     $notIn: [
            //                         // sequelize.literal("SELECT type FROM ThreadItems WHERE type=" + instantBook)
            //                         'intantBooking'
            //                     ]
            //                 }
            //             }

            //         ]
            //     }
            // });


            // const getThreadItems = await Threads.count({
            //     where: {
            //         listId
            //     },
            //     $or: [
            //         {
            //             guest: userId
            //         },
            //         {
            //             host: userId
            //         }
            //     ],
            //     include: [{
            //         model: ThreadItems,
            //         as: 'threadItems',
            //         require: true,
            //         where: {
            //             type: 'preApproved',
            //             sentBy: userId,
            //             $and: [
            //                 {
            //                     type: {
            //                         $notIn: [
            //                             sequelize.literal("SELECT type FROM ThreadItems WHERE type=" + dates)
            //                         ]
            //                     }
            //                 }

            //             ]
            //         }
            //     }]
            // });


            return {
                count: getReservation
            }


        } else {
            return {
                status: "notLoggedIn",
            };
        }
    }
};


export default getUpcomingBookings;




/**


query getUpcomingBookings ($listId: Int!){
  getUpcomingBookings(listId: $listId){
    count
  }
}


**/
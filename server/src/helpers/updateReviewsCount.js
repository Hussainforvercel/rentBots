// import { Listing, Reviews } from "../data/models";
import Listing from '../data/models/Listing.js';
import Reviews from '../data/models/Reviews.js';



export const updateReviewsCount = async ({ userId, listId }) => {

    const listing = await Listing.findOne({
        where: {
            id: listId,
            userId: userId
        }
    });

    if (listing) {
        let reviewsCount, reviewsStarRating;

        reviewsCount = await Reviews.count({
            where: {
                listId: listId,
                userId: userId,
                isAdminEnable: true
            }
        });

        reviewsStarRating = await Reviews.sum('rating', {
            where: {
                listId: listId,
                userId: userId,
                isAdminEnable: true
            }
        });

        if (reviewsStarRating > 0 && reviewsCount > 0) {
            await Listing.update({
                reviewsCount: Math.round(reviewsStarRating / reviewsCount)
            },
                {
                    where: { id: listId }
                });
        }
    }
}
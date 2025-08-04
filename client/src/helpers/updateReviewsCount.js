import { Listing, Reviews } from '../data/models';

const updateReviewsCount = async ({ userId, listId }) => {

    const listing = await Listing.findOne({
        where: {
            id: listId,
            userId: userId
        }
    });

    if (listing) {

        let reviewsCount = await Reviews.count({
            where: {
                listId: listId,
                userId: userId,
                isAdminEnable: true
            }
        });

        let reviewsStarRating = await Reviews.sum('rating', {
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

};

export default updateReviewsCount;

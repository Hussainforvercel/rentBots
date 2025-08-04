import {
    GraphQLInt as IntType,
    GraphQLBoolean as BooleanType
} from 'graphql';
import { WishList, Listing } from '../../models';
import WishListType from '../../types/WishListType';
import showErrorMessage from '../../../helpers/showErrorMessage';

const CreateWishList = {
    type: WishListType,
    args: {
        listId: { type: IntType },
        wishListGroupId: { type: IntType },
        eventKey: { type: BooleanType }
    },
    async resolve({ request, response }, { listId, wishListGroupId, eventKey }) {

        try {
            // Check whether user is logged in
            if (request?.user || request?.user?.admin) {
                const userId = request?.user?.id;
                const isListOwner = await Listing.count({
                    where: {
                        userId,
                        id: listId
                    }
                });

                if (isListOwner) {
                    return {
                        status: "listOwner"
                    };
                } else {
                    // Wish Lists
                    if (eventKey) {
                        let wishListCount = await WishList.count({
                            where: {
                                listId,
                                userId,
                                wishListGroupId,
                                isListActive: true
                            }
                        })

                        if (wishListCount === 0) {
                            await WishList.create({
                                listId,
                                userId,
                                wishListGroupId,
                                isListActive: true
                            });
                        }
                    } else {
                        await WishList.destroy({
                            where: {
                                listId,
                                userId,
                                wishListGroupId
                            }
                        });
                    }

                    return {
                        status: "success"
                    };
                }
            } else {
                return {
                    status: "notLoggedIn"
                };
            }
        } catch (error) {
            return {
                status: 400,
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
            }
        }
    },
};

export default CreateWishList;
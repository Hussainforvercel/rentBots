import {
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
} from 'graphql';
import { Listing, Recommend } from '../../models';
import ShowListingType from '../../types/ShowListingType';
import showErrorMessage from '../../../helpers/showErrorMessage';

const managePublish = {
    type: ShowListingType,
    args: {
        listId: { type: new NonNull(IntType) },
        action: { type: new NonNull(StringType) },
    },
    async resolve({ request }, { listId, action }) {

        try {
            // Check whether user is logged in
            if (request?.user || request?.user?.admin) {

                let where = { id: listId, isReady: true };
                if (!request.user.admin) {
                    where = {
                        id: listId,
                        isReady: true,
                        userId: request.user.id
                    }
                };

                var published;
                // Publish
                if (action === 'publish') {
                    await Listing.update({
                        isPublished: true
                    }, {
                        where
                    }).spread(function (instance) {
                        // Check if any rows are affected
                        if (instance > 0) {
                            published = true;
                        }
                    });
                }

                // UnPublish
                if (action === 'unPublish') {
                    await Listing.update({
                        isPublished: false
                    }, {
                        where
                    }).spread(function (instance) {
                        // Check if any rows are affected
                        if (instance > 0) {
                            published = true;
                        }
                    });
                    await Recommend.destroy({
                        where: {
                            listId
                        }
                    });
                }

                return {
                    status: published ? '200' : '400'
                };
            } else {
                return {
                    status: "notLoggedIn"
                };
            }
        } catch (error) {
            return {
                status: '400',
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
            }
        }
    },
};

export default managePublish;

/**
mutation ManagePublish($listId: Int!, $action: String!) {
    managePublish(listId: $listId, action: $action) {
        status
    }
}
 */

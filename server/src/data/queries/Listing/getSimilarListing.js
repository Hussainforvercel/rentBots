import {
  GraphQLInt as IntType,
  GraphQLFloat as FloatType,
} from 'graphql';
import  Listing  from '../../../data/models/Listing.js';
import ListType from '../../types/ListType.js';
import sequelize from '../../sequelize.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';

const getSimilarListing = {
  type: ListType,
  args: {
    lat: { type: FloatType },
    lng: { type: FloatType },
    listId: { type: IntType },
    limit: { type: IntType }
  },
  async resolve({ request }, { lat, lng, listId, limit }) {

    try {
      let similarLists = [], listsLimit, getSimilarResults;
      listsLimit = (limit) ? limit : 3;

      if (request && request.user) {
        const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
        if (userStatusErrorMessage) {
          return {
            status: userStatusError,
            errorMessage: userStatusErrorMessage
          };
        }
      }

      const similarListData = await sequelize.query(`
              SELECT
                    id,
                    (
                      6371 *
                      acos(
                          cos( radians( ${lat} ) ) *
                          cos( radians( lat ) ) *
                          cos(
                              radians( lng ) - radians( ${lng} )
                          ) +
                          sin(radians( ${lat} )) *
                          sin(radians( lat ))
                      )
                  ) AS distance
                FROM
                    Listing
                WHERE
                    (
                       lat IS NOT NULL
                    ) AND (
                       lng IS NOT NULL
                    ) AND (
                      id != ${listId}
                    ) AND (
                      isPublished = true
                    ) AND (
                    id NOT IN (SELECT listId FROM ListingData WHERE maxDaysNotice='unavailable')
                    )
                ORDER BY distance ASC
                LIMIT ${listsLimit}
                OFFSET 0 
    `, {
        type: sequelize.QueryTypes.SELECT
      });

      if (similarListData && similarListData.length > 0) {
        similarLists = similarListData.map((item) => { return item.id });

        getSimilarResults = Listing.findAll({
          where: {
            id: {
              $in: similarLists
            },
          }
        });

        return await {
          results: getSimilarResults,
          status: getSimilarResults ? 200 : 400,
          errorMessage: getSimilarResults ? null : await showErrorMessage({ errorCode: 'invalidError' }),
        }
      } else {
        return {
          status: 400,
          errorMessage: await showErrorMessage({ errorCode: 'noRecords' })
        }
      }
    }
    catch (error) {
      return {
        errorMessage: await showErrorMessage({ errorCode: 'catchError', error }),
        status: 400
      };
    }
  }
};

export default getSimilarListing;
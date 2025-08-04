
import {
  GraphQLList as List,
  GraphQLInt as IntType,
  GraphQLFloat as FloatType
} from 'graphql';
import sequelize from '../../sequelize';
import { Listing } from '../../../data/models';
import ShowListingType from '../../types/ShowListingType';

const getSimilarListing = {

  type: new List(ShowListingType),

  args: {
    lat: { type: FloatType },
    lng: { type: FloatType },
    listId: { type: IntType },
    limit: { type: IntType }
  },

  async resolve({ request }, { lat, lng, listId, limit }) {
    try {
      let similarLists = [], listsLimit = (limit) ? limit : 4;

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
        similarListData.map((item, index) => {
          similarLists.push(item.id);
        });

        return await Listing.findAll({
          where: {
            id: {
              $in: [similarLists]
            }
          }
        });
      } else {
        return null;
      }
    } catch (error) {
      return {
        status: '500'
      };
    }
  }
};

export default getSimilarListing;
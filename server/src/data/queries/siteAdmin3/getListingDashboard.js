import { Listing, UserListingSteps, ListPhotos } from '../../../data/models';
import ListingDashboardType from '../../types/siteadmin/ListingDashboardType';

const getListingDashboard = {

  type: ListingDashboardType,

  async resolve({ request }) {
    try {
      const include = [
        {
          model: UserListingSteps,
          attributes: ['id'],
          as: "userListingSteps",
          where: {
            step3: "completed"
          },
        },
        {
          model: ListPhotos,
          attributes: ['id'],
          as: "listPhotos",
          required: true
        }
      ];

      const totalCountQuery = await Listing.findAll({
        attributes: ['id'],
      });

      const totalCount = Object.keys(totalCountQuery).length;

      const todayCountQuery = await Listing.findAll({
        attributes: ['id'],
        where: {
          createdAt: {
            $lt: new Date(),
            $gt: new Date(new Date() - 24 * 60 * 60 * 1000)
          }
        },
        include,
      });

      const todayCount = Object.keys(todayCountQuery).length;

      const monthCountQuery = await Listing.findAll({
        attributes: ['id'],
        where: {
          createdAt: {
            $lt: new Date(),
            $gt: new Date(new Date() - 30 * 24 * 60 * 60 * 1000)
          }
        },
        include
      });

      const monthCount = Object.keys(monthCountQuery).length;

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

export default getListingDashboard;

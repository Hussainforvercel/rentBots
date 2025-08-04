var ical = require('ical-generator');
const url = process.env.SITE_URL;
const profilePhotouploadDir = process.env.PROFILE_PHOTO_UPLOAD_DIR; // User Profile Photos Upload Directory

import { getRange } from '../../../helpers/dateRange';
import { getConfigurationData } from '../../getConfigurationData';
import { isListExist, getBlockedDates } from './dbFunctions';

const exportICalRoutes = app => {

    app.get('/export-calendar', async function (req, res) {
        const siteData = await getConfigurationData({ name: ['siteName'] })
        var cal = ical({ domain: url, name: siteData.siteName });
        var listId = req.query['id'];
        var datesCollection = [];
        const listData = await isListExist(listId);
        if (listData) {
            const dates = await getBlockedDates(listId);
            if (dates && dates.length > 0) {
                datesCollection = getRange(dates);
                cal.clear();
                datesCollection.map((item) => {
                    cal.createEvent({
                        start: item.startDate,
                        end: item.endDate,
                        summary: siteData.siteName + ' - ' + listData.title,
                        description: listData.title,
                        location: listData.city,
                        url: url + '/cars/' + listData.id
                    });
                });
            } else {
                cal.clear();
            }
        } else {
            cal.clear();
        }
        cal.serve(res);
    })
};

export default exportICalRoutes;
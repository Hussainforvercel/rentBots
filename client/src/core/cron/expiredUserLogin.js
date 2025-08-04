var CronJob = require('cron').CronJob;
import { UserLogin } from '../../data/models';

const expiredUserLogin = app => {
    new CronJob('0 0 0 * * 0', async function () { // Cron Runs every Sunday midnight
        try {
            let year = new Date();
            year.setFullYear(year.getFullYear() - 1);

            await UserLogin.destroy({
                where: {
                    createdAt: {
                        $lte: year
                    }
                }
            });

        } catch (error) {
            console.log(error);
        }
    }, null, true, 'America/Los_Angeles')
}

export default expiredUserLogin;

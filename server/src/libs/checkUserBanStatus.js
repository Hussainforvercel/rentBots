import User from '../../src/data/models/User.js'
import showErrorMessage from '../helpers/showErrorMessage.js';

export default async function checkUserBanStatus(id) {
    let userStatusErrorMessage, userStatusError;
    const userStatus = await User.findOne({
        attributes: ['id', 'userBanStatus', 'userDeletedAt'],
        where: {
            id
        },
        raw: true
    });

    if (userStatus && userStatus.userBanStatus) {
        userStatusErrorMessage = await showErrorMessage({ errorCode: 'checkUserStatus' });
        userStatusError = 500;
    } else if (userStatus && userStatus.userDeletedAt) {
        userStatusErrorMessage = await showErrorMessage({ errorCode: 'findAccount' });
        userStatusError = 500;
    }

    return await {
        userBanStatus: userStatus && userStatus.userBanStatus,
        userDeletedAt: userStatus && userStatus.userDeletedAt,
        userStatusErrorMessage,
        userStatusError
    };
}
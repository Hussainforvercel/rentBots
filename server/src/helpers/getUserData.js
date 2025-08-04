// import { User, UserProfile } from '../data/models';
import User from '../data/models/User.js';
import UserProfile from '../data/models/UserProfile.js';

export async function getUser({ attributes, userId, profileAttributes }) {
    const data = await User.findOne({
        attributes,
        where: {
            id: userId
        },
        include: [{
            model: UserProfile, as: 'profile',
            attributes: profileAttributes,
        }],
        raw: true
    });
    return data;
}

export async function getUserEmail(id) {
    const userData = await User.findOne({
        attributes: ['email'],
        where: {
            id,
            userBanStatus: { $ne: true },
            userDeletedAt: null
        },
        raw: true
    });
    return { email: userData && userData.email };
}
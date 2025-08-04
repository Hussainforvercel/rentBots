// import { UserProfile, User } from '../../../../data/models';
import UserProfile from '../../../../data/models/UserProfile.js';
import User from '../../../../data/models/User.js';

export async function getCustomerId(
    userId
) {
    // Find Customer Id from UserProfile 
    const profile = await UserProfile.findOne({
        attributes: ['stripeCusId'],
        where: {
            userId
        },
        raw: true
    });

    if (profile) {
        return profile.stripeCusId;
    } else {
        return null;
    }    
}

export async function getCustomerEmail(
    userId
) {
    // Find Customer Id from UserProfile 
    const user = await User.findOne({
        attributes: ['email'],
        where: {
            id: userId
        },
        raw: true
    });

    if (user) {
        return user.email;
    } else {
        return null;
    }    
}
import UserProfile  from '../../../../data/models/UserProfile.js';

export async function updateUserProfile(userId, stripeCusId) {
    const profile = await UserProfile.update({
        stripeCusId
       },
       {
          where: {
              userId
          }
       });

    if (profile) {
        return {
          status: 'updated'
        };
    } else {
        return {
          status: 'failed to update the profile'
        }
    }
}
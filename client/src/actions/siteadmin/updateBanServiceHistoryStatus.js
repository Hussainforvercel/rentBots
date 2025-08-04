import { sendEmail } from '../../core/email/sendEmail';
// import sendSocketNotification from '../../core/socket/sendSocketNotification';
import showToaster from '../../helpers/toasterMessages/showToaster';
import { userManagement as query, updateBanServiceHistoryStatus as mutation } from '../../lib/graphql';

export const updateBanServiceHistoryStatus = (id, banStatus, userMail, userName, currentPage, searchList, adminMail) => {
    return async (dispatch, getState, { client }) => {

        try {
            const { data } = await client.mutate({
                mutation,
                variables: { id, banStatus },
                fetchPolicy: 'network-only',
                refetchQueries: [{ query, variables: { currentPage, searchList } }]
            });

            if ((data?.updateBanServiceHistoryStatus?.status === "success")) {
                let mailData = {
                    userName,
                    userMail,
                    adminMail
                }

                showToaster({ messageId: 'updateBanStatus', toasterType: 'success' })
                if (banStatus === '1') {
                    await sendEmail(userMail, 'banStatusServiceStatusBanned', mailData);
                    // sendSocketNotification(`userlogout-${id}`, '')
                } else if (banStatus === '0') {
                    await sendEmail(userMail, 'banStatusServiceStatusUnBanned', mailData);
                }
            } else {
                showToaster({ messageId: 'updateBanStatusFailed', toasterType: 'error' })
            }
        } catch (error) {
            showToaster({ messageId: 'selectBanOrUnBan', toasterType: 'warning' })
            return false;
        }
        return true;
    };
}

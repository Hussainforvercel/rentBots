import {
    GraphQLString as StringType,
    GraphQLInt as IntType,
} from 'graphql';
// import { ReportUser, UserProfile, User, SiteSettings } from '../../../data/models';
import ReportUser from '../../models/ReportUser.js';
import UserProfile from '../../models/UserProfile.js';
import User from '../../models/User.js';
import SiteSettings from '../../models/siteAdmin/SiteSettings.js'
import ReportUserCommonType from '../../types/ReportUserCommonType.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import { sendEmail } from '../../../libs/sendEmail.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';

const CreateReportUser = {
    type: ReportUserCommonType,
    args: {
        reporterId: { type: StringType },
        userId: { type: StringType },
        reportType: { type: StringType },
        profileId: { type: IntType },
        reporterName: { type: StringType }
    },
    async resolve({ request }, {
        reporterId,
        reportType,
        profileId,
        userId,
        reporterName
    }) {

        try {
            let content;
            const checkUser = await User.findOne({
                where: {
                    id: reporterId,
                    $or: [
                        {
                            userBanStatus: 0
                        },
                        {
                            userBanStatus: null
                        }
                    ]
                }
            });

            if (checkUser) {
                const getUser = await UserProfile.findOne({
                    attributes: ['userId', 'firstName'],
                    where: {
                        profileId
                    }
                });

                const adminEmail = await SiteSettings.findOne({
                    attributes: ['value'],
                    where: {
                        name: 'email'
                    },
                    raw: true
                });

                userId = getUser && getUser.userId;
                content = {
                    userName: getUser && getUser.firstName,
                    reporterName,
                    reportType,
                    defaultContent: true
                };

                if (request.user && !request.user.admin == true) {

                    const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
                    if (userStatusErrorMessage) {
                        return {
                            status: userStatusError,
                            errorMessage: userStatusErrorMessage
                        };
                    }

                    const createReport = await ReportUser.create({
                        reporterId: reporterId,
                        userId: userId,
                        reportType: reportType,
                    })

                    const { status, errorMessage } = await sendEmail(adminEmail.value, 'reportUser', content);

                    return {
                        status: 200,
                    }
                } else {
                    return {
                        status: 500,
                        errorMessage: await showErrorMessage({ errorCode: 'loginError' })
                    }
                }
            }
            else {
                return {
                    status: 500,
                    errorMessage: await showErrorMessage({ errorCode: 'invalidReportId' })
                }

            }
        } catch (error) {
            return {
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error }),
                status: 400
            }
        }
    },
};

export default CreateReportUser;

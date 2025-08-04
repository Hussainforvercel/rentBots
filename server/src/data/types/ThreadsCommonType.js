import {
    GraphQLObjectType as ObjectType,
    GraphQLID as ID,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLBoolean as BooleanType,
    GraphQLFloat as FloatType,
    GraphQLList as List,
} from 'graphql';
import UserProfile from '../../data/models/UserProfile.js'
import ThreadsType from './ThreadsType.js';
import ThreadItemsType from './ThreadItemsType.js';
import ProfileType from './ProfileType.js';

const ThreadsCommonType = new ObjectType({
    name: 'ThreadsCommon',
    fields: {
        results: { 
            type: ThreadsType
        },
        status: { 
            type: IntType 
        },
        errorMessage: { 
            type: StringType 
        },
        threadItems: {
            type: new List(ThreadItemsType)
        },
        hostProfile: {
            type: ProfileType,
            resolve(threads) {
                if(threads && threads.results){
                    return UserProfile.findOne({ where: { userId: threads.results['host'] } });
                }
            }
        },
        guestProfile: {
            type: ProfileType,
            resolve(threads) {
                if(threads && threads.results){
                    return UserProfile.findOne({ where: { userId: threads.results['guest'] } });
                }
            }
        },
    }
});

export default ThreadsCommonType;

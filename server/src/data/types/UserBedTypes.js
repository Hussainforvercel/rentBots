import {
    GraphQLObjectType as ObjectType,
    GraphQLInt as IntType,
} from 'graphql';
import ListSettings from './ListingSettingsType.js'

const UserBedTypes = new ObjectType({
    name: 'BedTypes',
    fields: {
        id: {
            type: IntType
        },
        listId: {
            type: IntType
        },
        bedCount: {
            type: IntType
        },
        bedType: {
            type: IntType
        },
        listsettings: {
            type: ListSettings,
            resolve(userBedType) {
                return userBedType.getListSettings();
            }
        },
    }
});

export default UserBedTypes;
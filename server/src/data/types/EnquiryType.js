import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
} from 'graphql';
import ThreadItemsType from './ThreadItemsType.js';

const EnquiryType = new ObjectType({
    name: 'Enquiry',
    fields: {
        result: {
            type: ThreadItemsType
        },
        status: { type: IntType },
        errorMessage: { type: StringType }
    },
});

export default EnquiryType;

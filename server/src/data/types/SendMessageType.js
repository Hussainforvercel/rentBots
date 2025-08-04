import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
} from 'graphql';
import ThreadItemsType from './ThreadItemsType.js';

const SendMessageType = new ObjectType({
    name: 'SendMessage',
    fields: {
        results: { 
            type: ThreadItemsType
        },
        status: { 
            type: IntType 
        },
        message: { 
            type: StringType 
        },
        errorMessage: { 
            type: StringType 
        },
        actionType: { 
            type: StringType 
        },
    }
});

export default SendMessageType;

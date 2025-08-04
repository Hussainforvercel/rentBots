import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
} from 'graphql';
import NewThreadsType from './NewThreadsType.js';

const NewThreadsCommonType = new ObjectType({
    name: 'NewThreadsCommonType',
    fields: {
        results: { 
            type: NewThreadsType
        },
        status: { 
            type: IntType 
        },
        errorMessage: { 
            type: StringType 
        },
    }
});

export default NewThreadsCommonType;

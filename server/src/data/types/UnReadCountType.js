import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLBoolean as BooleanType,
} from 'graphql';

const UnReadCount = new ObjectType({
    name: 'UnReadCount',
    fields: {
        ownerCount: {
            type: IntType
        },
        renterCount: {
            type: IntType
        },
        total: {
            type: IntType
        },
        userBanStatus: {
            type: IntType
        },
        isUnReadMessage: {
            type: BooleanType
        },
        messageCount: {
            type: IntType
        }
    },
  });

const UnReadCountType = new ObjectType({
    name: 'UnreadThreadsCount',
    fields: {
        results: { 
            type: UnReadCount
        },
        status: { 
            type: IntType 
        },
        errorMessage: { 
            type: StringType 
        }
    }
});

export default UnReadCountType;
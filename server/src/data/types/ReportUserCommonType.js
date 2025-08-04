import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
} from 'graphql';
import ReportUserType from './ReportUserType.js';

const ReportUserCommonType = new ObjectType({
    name: 'ReportUserResult',
    fields: {
        results: { 
            type: ReportUserType
        },
        status: { 
            type: IntType 
        },
        errorMessage: { 
            type: StringType 
        }
    }
});

export default ReportUserCommonType;

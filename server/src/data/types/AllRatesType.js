import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLFloat as FloatType
} from 'graphql';


const AllRatesType = new ObjectType({
    name: 'AllRatesType',
    fields: {
        currencyCode: { 
            type: StringType 
        },
        rate: { 
            type: FloatType 
        },
        base: { type: StringType },
        rates: { type: StringType },
    },
});

export default AllRatesType;
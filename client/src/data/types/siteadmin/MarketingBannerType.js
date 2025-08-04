import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLBoolean as BooleanType,
} from 'graphql';

const MarketingBannerType = new ObjectType({
    name: 'MarketingBanner',
    fields: {
        status: { type: StringType },
        id: { type: IntType },
        title: { type: StringType },
        image: { type: StringType },
        link: { type: StringType },
        buttonText: { type: StringType },
        isEnable: { type: BooleanType },
        errorMessage: { type: StringType }
    }
});

export default MarketingBannerType; 
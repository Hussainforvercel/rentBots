import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLBoolean as BooleanType,
} from 'graphql';

const ImageBanner = new ObjectType({
    name: 'ImageBanner',
    fields: {
        id: {
            type: IntType
        },
        title: {
            type: StringType
        },
        description: {
            type: StringType
        },
        buttonLabel: {
            type: StringType
        },
        image: {
            type: StringType
        },
        status: {
            type: StringType
        },
        buttonLabel2: {
            type: StringType
        },
        buttonLink1: {
            type: StringType
        },
        buttonLink2: {
            type: StringType
        },
        isEnable: {
            type: BooleanType
        },
    }


});


const ImageBannerType = new ObjectType({
    name: 'ImageBannerType',
    fields: {
        result: {
            type: ImageBanner
        },
        status: {
            type: IntType
        },
        errorMessage: {
            type: StringType
        },
    }
});

export default ImageBannerType;
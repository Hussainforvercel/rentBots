import {
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLObjectType as ObjectType,
    GraphQLList as ListType,
    GraphQLBoolean as BooleanType
} from 'graphql';

const categoryCsvUploader = new ObjectType({
    name: "VehicleCategoryCsvUploader",
    fields: {
        duplicateDatas: { type: new ListType(new ListType(StringType)) },
        isUploadedCsv: { type: BooleanType },
        make: { type: BooleanType },
        model: { type: BooleanType }
    }
});

const CSVImportType = new ObjectType({
    name: 'VehicleCategoryCsvUploadCommonType',
    fields: {
        status: { type: IntType },
        errorMessage: { type: StringType },
        result: { type: categoryCsvUploader },
        results: { type: new ListType(categoryCsvUploader) }
    }
});

export { CSVImportType, categoryCsvUploader };
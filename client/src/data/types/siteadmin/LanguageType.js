import {
  GraphQLObjectType as ObjectType,
  GraphQLInt as IntType,
  GraphQLString as StringType,
} from 'graphql';

const LanguageType = new ObjectType({
  name: 'Language',
  fields: {
    id: { type: IntType },
    title: { type: StringType },
    code: { type: StringType },
    fileURL: { type: StringType },
  },
});

export default LanguageType; 
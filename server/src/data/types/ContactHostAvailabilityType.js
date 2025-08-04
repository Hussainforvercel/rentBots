import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const ContactHostAvailabilityType = new ObjectType({
  name: 'ContactHostAvailability',
  fields: {
    listId: { type: new NonNull(IntType) },
    startDate: { type: new NonNull(StringType) },
    endDate: { type: new NonNull(StringType) },
    status: { type: StringType },
    errorMessage: { type: StringType }
  },
});

export default ContactHostAvailabilityType;

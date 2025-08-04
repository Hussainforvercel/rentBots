import {
    GraphQLList as List
} from 'graphql';
import { BlogDetails } from '../models';
import BlogDetailsType from '../types/BlogDetailsType';

const getBlogDetails = {

    type: new List(BlogDetailsType),

    async resolve({ request }) {

        return await BlogDetails.findAll({
        });

    }
};

export default getBlogDetails;


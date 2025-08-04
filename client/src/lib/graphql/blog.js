import { gql } from 'react-apollo';

export const getBlogDetails = gql`
    query getBlogDetails {
        getBlogDetails{
           id
           metaTitle
           metaDescription
           pageUrl
           pageTitle
           content
           footerCategory
           isEnable
           createdAt
        }
    }
    `;

export const deleteBlogDetailsMutation = gql`
    mutation deleteBlogDetails ($id: Int!) {
        deleteBlogDetails (id: $id) {
            status
        }
        }
    `;

export const updateBlogStatusMutation = gql`
    mutation updateBlogStatus ($id: Int, $isEnable: Boolean){
      updateBlogStatus(id: $id, isEnable: $isEnable){
            status
        }
    }
    `;
import { gql } from 'react-apollo';

export const updateReview = gql`
    mutation updateReview($id: Int, $type: String){
         updateReview(id: $id, type: $type) {
           status
         }
       }
    `;

export const deleteReviewMutation = gql`mutation deleteWhyHostReview ($reviewId: Int!) {
      deleteWhyHostReview (reviewId: $reviewId) {
        status
        errorMessage
      }
    }`;

export const updateReviewMutation = gql`mutation updateWhyHostReview ($id: Int, $userName: String, $image: String, $reviewContent: String, $isEnable: Boolean) {
      updateWhyHostReview (id: $id, userName: $userName, image: $image, reviewContent: $reviewContent, isEnable: $isEnable) {
        status
        errorMessage
      }
    }`
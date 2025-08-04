import { gql } from 'react-apollo';

export const getStaticInfoQuery = gql`
    query ($name: String) {
      getStaticInfo(name: $name) {
        id
        title
        name
        value
      }
    }
    `;

export const uploadStaticBlockImageMutation = gql`
    mutation uploadStaticBlockImage($fileName: String, $name: String) {
      uploadStaticBlockImage (fileName:$fileName, name:$name) {
        status
      }
    }
    `;

export const removeStaticBlockImagesMutation = gql`
    mutation removeStaticBlockImages($name: String){
      removeStaticBlockImages(name: $name){
        status
      }
    }
    `;

import { gql } from 'react-apollo';

export const getPopularLocation = gql`
    query getPopularLocation {
        getPopularLocation{
        id
        location
        locationAddress
        image
        isEnable
        createdAt
        updatedAt
        }
    }
    `;

export const deletePopularLocationMutation = gql`
    mutation deletePopularLocation ($id: Int!) {
      deletePopularLocation (id: $id) {
          status
        }
      }
    `;

export const updatePopularLocationStatusMutation = gql`
    mutation updatePopularLocationStatus ($id: Int, $isEnable: String){
      updatePopularLocationStatus(id: $id, isEnable: $isEnable){
            status
        }
    }
    `;

export const getStaticInfo = gql`
    {
      getStaticInfo {
          id
          title
          name
          value
        }
    }
    `;

export const updateFindYourBlock = gql`
    mutation updateFindYourBlock(
        $heading: String,
        $buttonLabel: String,
        $buttonLink: String,
        $content1: String,
        $content2: String,
        $content3: String,
        $content4: String,
        $content5: String,
        $image: String
        ){
            updateFindYourBlock(
            heading: $heading,
            buttonLabel: $buttonLabel,
            buttonLink: $buttonLink,
            content1: $content1,
            content2: $content2,
            content3: $content3,
            content4: $content4,
            content5: $content5,
            image: $image
        ) {
            status
        }
    }
    `;

export const getFindYourVehicleBlockQuery = gql`{
    getFindYourVehicleBlock {
        results{
            id
            name
            value
        }
        status
      }
    }`;

export const getHomeLogo = gql`
    query getHomeLogo{
      getHomeLogo {
        id
        title
        name
        value
        type
      }
    }
    `;

export const uploadHomeLogoMutation = gql`
    mutation uploadHomeLogo($fileName: String) {
      uploadHomeLogo (fileName:$fileName) {
        status
      }
    }
    `;

export const removeHomeLogoMutation = gql`
    mutation removeHomeLogo{
      removeHomeLogo{
        status
      }
    }
    `;

export const getBanner = gql`
    {
        getBanner {
          id
          title
          content
          image
        }
      }
    `;

export const uploadHomeBanner = gql`
    mutation uploadHomeBanner($image: String!, $id: Int!){
        uploadHomeBanner(image: $image, id: $id) {
            status
        }
    }
    `;

export const getImageBanner = gql`
    {
        getImageBanner {
            id
            title
            description
            buttonLabel
            image
            buttonLabel2
            buttonLink1
            buttonLink2
        }
    }
    `;

export const updateImageBannerMutation = gql`
    mutation updateImageBanner(
        $title: String!,
        $description: String!,
        $buttonLabel: String!,
        $buttonLabel2: String,
        $buttonLink1: String,
        $buttonLink2: String
        ){
        updateImageBanner(
            title: $title,
            description: $description,
            buttonLabel: $buttonLabel,
            buttonLabel2: $buttonLabel2,
            buttonLink1: $buttonLink1,
            buttonLink2: $buttonLink2
        ) {
            status
        }
    }
    `;

export const uploadImageBannerMutation = gql`
    mutation uploadImageBanner($image: String!){
        uploadImageBanner(image: $image) {
            status
        }
    }
    `;

export const editPopularLocation = gql`
    query editPopularLocation ($id: Int!) {
      editPopularLocation (id: $id) {
          id
          location
          locationAddress
          isEnable
          image
      }
    }
    `;

export const uploadLocationMutation = gql`
    mutation uploadLocation(
      $id: Int,
      $image: String,
    ) {
      uploadLocation(
        id: $id,
        image: $image,
      ) {
          status
      }
    }
    `;

export const removeLocationMutation = gql`
    mutation removeLocation(
      $id: Int!,
      $image: String,
    ) {
      removeLocation(
        id: $id,
        image: $image,
      ) {
          status
      }
    }
    `;
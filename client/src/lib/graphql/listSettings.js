import { gql } from 'react-apollo';

export const deleteListSettings = gql`
    query($id:Int, $typeId: Int) {
      deleteListSettings(id: $id, typeId: $typeId){
          status
          errorMessage
          }
        }
    `;

export const getAllAdminListSettings = gql`
    query ($currentPage: Int,$typeId: Int) {
    	getAllAdminListSettings(currentPage: $currentPage,typeId: $typeId){
        status
        errorMessage
        listSettingsTypeData {
          id
          typeName
          typeLabel
          fieldType
          isEnable
          step
        }
        count
        listSettingsData {
          id
          typeId
          itemName
          itemDescription
          otherItemName
          startValue
          endValue
          maximum
          minimum
          isEnable
          makeType
      	}
    	}  	
    }
    `;

export const getCarDetails = gql`
    query {
      getCarDetails{
            id
            typeName
          typeLabel
          fieldType
            isEnable
            step
          listSettings {
            id
            typeId
            itemName
            itemDescription
            otherItemName
            startValue
            endValue
            maximum
            minimum
            isEnable
            makeType
          }
          status
          }
        }
    `;
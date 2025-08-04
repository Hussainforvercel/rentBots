import { gql } from 'react-apollo';

export const getAllCurrencyQuery = gql`query getAllCurrencies{
    getCurrencies {
        id
        symbol
        isEnable
        isPayment
        isBaseCurrency
        status
      }
    }`;

export const getBaseCurrencyQuery = gql`
    {
        getBaseCurrency{
          id
          symbol
        }
    }`;

export const currencyManagementMutation = gql`
    mutation currencyManagement ($id: Int, $isEnable: Boolean){
        currencyManagement(id: $id, isEnable: $isEnable){
            status
        }
    }
    `;

export const setBaseCurrencyMutation = gql`
    mutation setBaseCurrency($id: Int){
        baseCurrency(id: $id){
            status
        }
    }
    `;

export const managePaymentCurrency = gql`
    mutation managePaymentCurrency(
      $currencyId: Int!, 
      $type: String!
    ){
        managePaymentCurrency(
          currencyId: $currencyId, 
          type: $type
        ) {
            status
        }
    }
    `;

export const getCurrencies = gql`
    {
      getCurrencies {
        id
        symbol
        isEnable
        isPayment
        isBaseCurrency
        status
      }
    }
`;

export const currency = gql`
    {
      Currency{
          base
          rates
      }
    }
    `;


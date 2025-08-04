import showToaster from '../../../helpers/toasterMessages/showToaster';
import { getAdminListingSettings } from '../getAdminListingSettings';
import { getCarType } from "../getCarType";
import { makeModelCsvUploaderMutation } from "../../../lib/graphql";
import { setLoaderStart, setLoaderComplete } from "../../../actions/loader/loader";
import {
    IMPORT_CSV_FILE_ERROR,
    IMPORT_CSV_FILE_START,
    IMPORT_CSV_FILE_SUCCESS
} from "../../../constants";

export const makeModelCsvUploader = ({ categoryList, typeId, setEmptyValue }) => {
    return async (dispatch, getState, { client }) => {
        try {

            let bothDuplicateValues = [], flag = false, isDuplicate = false;
            dispatch({ type: IMPORT_CSV_FILE_START });


            if (categoryList?.length > 3000) {
                await showToaster({ messageId: 'limitExceed', toasterType: 'error' });
                setEmptyValue;
                return;
            };

            /* Check first Make value  */
            if ((categoryList?.length == 0 || categoryList[0][0] === '')) {
                await showToaster({ messageId: 'checkMakeDetails', toasterType: 'error' })
                setEmptyValue;
                return;
            };

            /* Check imported CSV has data. */
            if (categoryList?.length == 1 && categoryList[0]?.includes('')) {
                await showToaster({ messageId: 'noDataFound', toasterType: 'error' })
                setEmptyValue;
                return;
            };

            dispatch(setLoaderStart('makeModelCsvUploading'));

            /* Collect duplicate data. */
            categoryList?.map((val, index) => {
                let bothDuplicateResult = categoryList.find((item, idx) => index != idx && item.toString() === val.toString());
                if (bothDuplicateResult) {
                    bothDuplicateValues.push(bothDuplicateResult);
                    flag = true;
                }
            });

            /* if Duplicate data is found in importes CSV. */
            if (flag && bothDuplicateValues && bothDuplicateValues.length > 0) {
                bothDuplicateValues = bothDuplicateValues.map(item => item.toString());
                bothDuplicateValues = [...new Set(bothDuplicateValues)];
                isDuplicate = true;
                await showToaster({ messageId: 'importDuplicateItems', toasterType: 'error' });
                dispatch(setLoaderComplete('makeModelCsvUploading'));
                setEmptyValue;
                return;
            };

            const { data } = await client.mutate({
                mutation: makeModelCsvUploaderMutation,
                variables: { csvValue: categoryList.filter(item => item.some(val => (val && val.trim() != "") || (val != ""))) }
            });

            if (data?.makeModelCsvUploader) {

                if (data?.makeModelCsvUploader?.status === 400) {
                    await showToaster({ messageId: 'commonError', toasterType: 'error', requestMessage: data?.makeModelCsvUploader?.errorMessage })
                    dispatch({ type: VEHICLE_CATEGORY_CSV_UPLOAD_ERROR });
                    dispatch(setLoaderComplete('makeModelCsvUploading'));
                    return;
                };

                /* Success status. */
                if (data?.makeModelCsvUploader?.result?.make || data?.makeModelCsvUploader?.result?.model) {
                    await showToaster({ messageId: 'importSuccess', toasterType: 'success' });
                }

                /* Duplicate Data. */
                if (data?.makeModelCsvUploader?.result?.duplicateDatas?.length > 0 && !isDuplicate) {
                    await showToaster({ messageId: 'duplicateFiles', toasterType: 'error' });
                    dispatch(setLoaderComplete('makeModelCsvUploading'));
                    return;
                };

                await dispatch(getAdminListingSettings(typeId));
                await dispatch(getCarType());
                dispatch({ type: IMPORT_CSV_FILE_SUCCESS });
                dispatch(setLoaderComplete('makeModelCsvUploading'));
            }

        } catch (error) {
            await showToaster({ messageId: 'importCsvFileError', toasterType: 'error' })
            dispatch({ type: IMPORT_CSV_FILE_ERROR })
            dispatch(setLoaderComplete('makeModelCsvUploading'));
        }
    }
}
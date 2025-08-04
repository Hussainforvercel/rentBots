import {
    GraphQLString as StringType,
    GraphQLList as ListType,
    GraphQLNonNull as NonNull
} from "graphql";
import { ListSettings } from "../../models";
import { CSVImportType } from "../../types/siteadmin/CSVImportType";
import showErrorMessage from "../../../helpers/showErrorMessage";

const makeModelCsvUploader = {
    type: CSVImportType,
    args: { csvValue: { type: new NonNull(new ListType(new ListType(StringType))) } },

    async resolve({ request }, { csvValue }) {
        try {

            let duplicateDatas = [], isNewData = false, filterData = [], createMake, createModel;
            if (request.user && request.user.admin == false) {
                return {
                    status: 400,
                    errorMessage: await showErrorMessage({ errorCode: 'errorLogin' })
                }
            };

            if (csvValue && csvValue.length > 0) {
                await Promise.all([
                    (() => {
                        let filterModelData, filterMakeData;

                        /* make section. */
                        filterMakeData = csvValue.filter(item => item && item[0] && item[0].trim());
                        csvValue = [...filterMakeData];

                        /* model section. */
                        filterModelData = csvValue.filter(item => item && item[1] && item[1].trim());
                        csvValue = filterModelData.length ? [...filterModelData] : [...csvValue];

                        for (let index = 0; index < csvValue.length; index++) {
                            if (csvValue[index] && csvValue[index].length > 0) {

                                /* If make is provided and model is not. */
                                if (csvValue[index][0] && !csvValue[index][1]) {
                                    filterData.push(csvValue[index]);
                                }
                                /* If make is not provided and model is provided(duplicate records). */
                                else if (!csvValue[index][0] && csvValue[index][1]) {
                                    duplicateDatas.push(csvValue[index]);
                                } else {
                                    filterData.push(csvValue[index]);
                                };
                            }
                        };
                        csvValue = [...filterData];
                    })()
                ]);
                await Promise.all([(async () => {
                    for (let index = 0; index < csvValue.length; index++) {

                        /* Find if any imported record matches with record in ListSettings (Make). */
                        const isExistsMake = await ListSettings.findOne({
                            attributes: ["id", 'itemName'],
                            where: {
                                itemName: csvValue[index][0].trim(),
                                typeId: 20
                            },
                            raw: true
                        });

                        if (isExistsMake) {
                            if (!csvValue[index][1]) {
                                duplicateDatas.push(csvValue[index]);
                                continue;
                            } else {
                                duplicateDatas.push(csvValue[index]);
                            }
                        }
                        else {
                            isNewData = true;
                            createMake = await ListSettings.create({
                                itemName: csvValue[index][0].trim(),
                                typeId: 20,
                                isEnable: true
                            });
                        };
                        /* Find make data from ListSettings. */
                        const listSettingData = await ListSettings.findOne({
                            attributes: ['id'],
                            where: {
                                itemName: csvValue[index][0].trim(),
                                typeId: 20
                            },
                            raw: true
                        });

                        /* Find if any imported record matches with record in ListSettings (Make). */
                        if (csvValue[index][1]) {
                            const isExistModel = await ListSettings.findOne({
                                attributes: ["id"],
                                where: {
                                    itemName: csvValue[index][1].trim(),
                                    typeId: 3
                                },
                                raw: true
                            });
                            if (isExistModel) {
                                isNewData = true;
                                duplicateDatas.push(csvValue[index]);
                                continue;
                            } else {
                                await ListSettings.update(
                                    { isEnable: 1 },
                                    { where: { id: listSettingData.id, typeId: 20, } });
                                createModel = await ListSettings.create({
                                    itemName: csvValue[index][1].trim(),
                                    typeId: 3,
                                    makeType: listSettingData.id
                                });
                            }
                        }
                    }
                })()])
            };
            return {
                status: 200,
                result: {
                    duplicateDatas: duplicateDatas.filter(item => item.some(val => (val && val.trim() != "") || (val != ""))),
                    isUploadedCsv: !isNewData ? false : csvValue.length > 0 || false,
                    make: createMake ? true : false,
                    model: createModel ? true : false,
                }
            }

        } catch (error) {
            return {
                status: 400,
                error: await showErrorMessage({ errorCode: 'catchError', error })
            }
        }
    }
};

export default makeModelCsvUploader;
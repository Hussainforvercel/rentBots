import { SubmissionError } from 'redux-form';
import { FormattedMessage, injectIntl } from 'react-intl';
import fetch from '../../core/fetch';
import messages from '../../locale/messages';
import { getListingData } from '../../actions/getListing';
import { getListingDataStep3 } from '../../actions/getListingDataStep3';
import { manageListingSteps } from '../../actions/manageListingSteps';
import { setLoaderStart, setLoaderComplete } from '../../actions/loader/loader';
import { updateListingStep3 } from '../../lib/graphql';
import history from '../../core/history';

async function updateStep3(values, dispatch, props, getState) {
    console.log(values, "third step values");

    
    const mergedValues = { ...values };

    // Extract fields from merged values
    let weeklyDiscount = mergedValues.weeklyDiscount != '' ? mergedValues.weeklyDiscount : 0,
        monthlyDiscount = mergedValues.monthlyDiscount != '' ? mergedValues.monthlyDiscount : 0,
        delivery = mergedValues.delivery != '' ? mergedValues.delivery : 0,
        securityDeposit = mergedValues.securityDeposit ? Number(mergedValues.securityDeposit) : 0,
        id = mergedValues.id,
        carRules = mergedValues.carRules,
        bookingNoticeTime = mergedValues.bookingNoticeTime,
        checkInStart = mergedValues.checkInStart,
        checkInEnd = mergedValues.checkInEnd,
        maxDaysNotice = mergedValues.maxDaysNotice,
        minDay = mergedValues.minDay ? mergedValues.minDay : 0,
        maxDay = mergedValues.maxDay ? mergedValues.maxDay : 0,
        hourlyPrice = mergedValues.hourlyPrice ? Number(mergedValues.hourlyPrice) : 0,
        hourlyDiscount = mergedValues.hourlyDiscount ? Number(mergedValues.hourlyDiscount) : 0,
        dailyDiscount = mergedValues.dailyDiscount ? Number(mergedValues.dailyDiscount) : 0,
        minHours = mergedValues.minHours ? Number(mergedValues.minHours) : 0,
        maxHours = mergedValues.maxHours ? Number(mergedValues.maxHours) : 0,
        basePrice = mergedValues.basePrice,
        currency = mergedValues.currency,
        cancellationPolicy = mergedValues.cancellationPolicy;

    dispatch(setLoaderStart('updateListing'));

    const query = `mutation (
        $id: Int,
        $carRules: [Int],
        $checkInStart:String,
        $checkInEnd:String,
        $minDay:Int,
        $maxDay:Int,
        $cancellationPolicy: Int,
        $maxDaysNotice: String,
        $bookingNoticeTime: String,
        $basePrice: Float,
        $delivery: Float,
        $currency: String,
        $weeklyDiscount:Float,
        $monthlyDiscount:Float,
        $securityDeposit: Float,
        $minHours: Int,
        $maxHours: Int,
        $hourlyPrice: Float,
        $hourlyDiscount: Float,
        $dailyDiscount: Float,
        $bookingType: String!
    ) {
        updateListingStep3(
            id: $id,
            carRules: $carRules,
            checkInStart:$checkInStart,
            checkInEnd:$checkInEnd,
            minDay:$minDay,
            maxDay:$maxDay,
            cancellationPolicy: $cancellationPolicy,
            maxDaysNotice: $maxDaysNotice,
            bookingNoticeTime: $bookingNoticeTime,
            basePrice: $basePrice,
            delivery: $delivery,
            currency: $currency,
            weeklyDiscount:$weeklyDiscount,
            monthlyDiscount:$monthlyDiscount,
            securityDeposit: $securityDeposit,
            minHours: $minHours,
            maxHours: $maxHours,
            hourlyPrice: $hourlyPrice,
            hourlyDiscount: $hourlyDiscount,
            dailyDiscount: $dailyDiscount,
            bookingType: $bookingType
        ) {
            status
        }
    }`;

    const resp = await fetch('/graphql', {
        method: 'post',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: query,
            variables: {
                id,
                carRules,
                checkInStart,
                checkInEnd,
                minDay,
                maxDay,
                cancellationPolicy,
                maxDaysNotice,
                bookingNoticeTime,
                basePrice,
                delivery,
                currency,
                weeklyDiscount,
                monthlyDiscount,
                securityDeposit,
                minHours,
                maxHours,
                hourlyPrice,
                hourlyDiscount,
                dailyDiscount,
                bookingType: mergedValues.bookingType || 'request'
            }
        }),
        credentials: 'include'
    });

    const { data } = await resp.json();

    if (data && data.updateListingStep3 != undefined) {
        if (data.updateListingStep3.status == "success") {
            await dispatch(manageListingSteps(mergedValues.id, 3));
            history.push('/become-a-owner/' + mergedValues.id + '/home');
            await dispatch(setLoaderComplete('updateListing'));
            await dispatch(getListingDataStep3(mergedValues.id));
        } else if (data.updateListingStep3.status == "notLoggedIn") {
            dispatch(setLoaderComplete('updateListing'));
            throw new SubmissionError({ _error: messages.notLoggedIn });
        } else {
            dispatch(setLoaderComplete('updateListing'));
            throw new SubmissionError({ _error: messages.somethingWentWrong });
        }
    } else {
        dispatch(setLoaderComplete('updateListing'));
        throw new SubmissionError({ _error: messages.somethingWentWrong });
    }
}

export default updateStep3;
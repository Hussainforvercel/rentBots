import messages from '../../locale/messages';


const validateStep3 = values => {

	const errors = {};

	if (!values?.basePrice) {
		errors.basePrice = messages.required;
	}

	if (isNaN(values?.basePrice) || (!/^[0-9\.]+$/.test(values?.basePrice)) || (parseFloat(values?.basePrice, 10) < 1)) {
		errors.basePrice = messages.basePriceInvalid;
	}
	if (isNaN(values?.hourlyPrice) || (!/^[0-9\.]+$/.test(values?.hourlyPrice)) || (parseFloat(values?.hourlyPrice, 10) < 1)) {
		errors.hourlyPrice = messages.hourPriceInvalid;
	}
	if (values?.delivery) {
		if (isNaN(values?.delivery) || (!/^[0-9\.]+$/.test(values?.delivery)) || (parseInt(values?.delivery, 10) < 1)) {
			errors.delivery = messages.cleaningPriceInvalid;
		}
	}

	if (values?.securityDeposit && (isNaN(values?.securityDeposit) || (!/^[0-9\.]+$/.test(values?.securityDeposit)) || (parseFloat(values?.securityDeposit, 10) < 1))) {
		errors.securityDeposit = messages.securityDepositInvalid;
	}

	if (values?.weeklyDiscount) {
		if (isNaN(values?.weeklyDiscount) || (!/^[0-9]+$/.test(values?.weeklyDiscount)) || (parseInt(values?.weeklyDiscount, 10) < 0) || parseInt(values?.weeklyDiscount, 10) > 99) {
			errors.weeklyDiscount = messages.discountInvalid;
		}
	}

	if (values?.monthlyDiscount) {
		if (isNaN(values?.monthlyDiscount) || (!/^[0-9]+$/.test(values?.monthlyDiscount)) || (parseInt(values?.monthlyDiscount, 10) < 0) || parseInt(values?.monthlyDiscount, 10) > 99) {
			errors.monthlyDiscount = messages.discountInvalid;
		}
	}

	if (values?.minDay > values?.maxDay) {
		errors.minDay = messages.tripLengthError1;
	}

	if (values?.minHours > values?.maxHours) {
		errors.minHours = messages.tripLengthError1;
	}

	return errors;
}

export default validateStep3;

import stripePackage from 'stripe';
import { getCustomerId } from './helpers/getCustomerId';
import { updateUserProfile } from './helpers/updateUserProfile';
import { updatePaymentData, createPaymentIntent, confirmPaymentIntent, createCustomerData } from './helpers/stripeHelpers';
import { payment } from '../../../config-sample';
const stripe = stripePackage(payment.stripe.secretKey);

const stripePayment = app => {
	app.post('/stripe-reservation', async function (req, res) {
		const reservationDetails = req.body.reservationDetails;
		const paymentMethodId = req.body.paymentMethodId;
		let customerId, intent, paymentIntentSecret;
		let status = 200, errorMessage, requireAdditionalAction = false, paymentIntentId, redirect;
		if (reservationDetails) {
			customerId = await getCustomerId(reservationDetails.guestId);
		} else {
			status = 400;
			errorMessage = 'Something Went Wrong, please try again';
		}

		if (!customerId && status === 200) {
			const { customerStatus, error, createCustomer } = await createCustomerData({ reservationDetails });
			if (customerStatus != 200) {
				status = 400;
				errorMessage = error;
			} else {
				if ('id' in createCustomer) {
					customerId = createCustomer.id;
					await updateUserProfile(
						reservationDetails.guestId,
						customerId
					);
				}
			}
		}
		if (status === 200) {
			try {
				intent = await createPaymentIntent({ paymentMethodId, reservationDetails, customerId })
				if (intent && (intent.status === 'requires_source_action' || intent.status === 'requires_action') && intent.next_action.type === 'use_stripe_sdk') {
					status = 400;
					requireAdditionalAction = true;
					paymentIntentSecret = intent.client_secret
				} else if (intent && intent.status === 'succeeded') {
					status = 200;
				} else {
					status = 400;
					errorMessage = 'Sorry, something went wrong with your card. Please try again.';
				}
			} catch (error) {
				status = 400;
				errorMessage = error.message;
			}
		}
		if (status === 200 && intent && 'id' in intent) {
			paymentIntentId = intent.id;
			await updatePaymentData({ reservationDetails, paymentIntentId, customerId, intent });
		}
		redirect = '/users/trips/itinerary/' + reservationDetails.reservationId;
		res.send({ status, errorMessage, redirect, paymentIntentSecret });
	});

	app.post('/stripe-reservation-confirm', async function (req, res) {
		const confirmPaymentIntentId = req.body.confirmPaymentIntentId
		const reservationDetails = req.body.reservationDetails;
		let status = 200, errorMessage, customerId, redirect;
		if (reservationDetails) {
			customerId = await getCustomerId(reservationDetails.guestId);
		} else {
			status = 400;
			errorMessage = 'Sorry, something went wrong. Please try again.';
		}
		const { intentStatus, error, confirmIntent } = await confirmPaymentIntent({ confirmPaymentIntentId });
		if (intentStatus != 200) {
			res.send({ status: 400, errorMessage: error });
		} else {
			if (intentStatus === 200 && confirmIntent && 'id' in confirmIntent) {
				await updatePaymentData({ reservationDetails, paymentIntentId: confirmPaymentIntentId, customerId, intent: confirmIntent });
			}
			redirect = '/users/trips/itinerary/' + reservationDetails.reservationId;
			res.send({ status, errorMessage, redirect });
		}
	});
};

export default stripePayment;
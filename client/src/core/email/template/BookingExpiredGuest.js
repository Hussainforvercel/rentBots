import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Table, TBody, TR, TD } from 'oy-vey';
import Layout from '../layouts/Layout';
import Header from '../modules/Header';
import Body from '../modules/Body';
import Footer from '../modules/Footer';
import EmailSignature from './EmailSignature';
import EmptySpace from '../modules/EmptySpace';
import { COMMON_TEXT_COLOR } from '../../../constants/index';

class BookingExpiredGuest extends Component {
	static propTypes = {
		content: PropTypes.shape({
			listTitle: PropTypes.string.isRequired,
			guestName: PropTypes.string.isRequired,
			checkIn: PropTypes.string.isRequired,
			confirmationCode: PropTypes.number.isRequired,
			siteName: PropTypes.string.isRequired,
		}).isRequired
	};

	render() {
		const textStyle = {
			color: COMMON_TEXT_COLOR,
			backgroundColor: '#F7F7F7',
			fontFamily: 'Arial',
			fontSize: '16px',
			padding: '35px',
		};


		const { content: { guestName, listTitle, confirmationCode, checkIn, hostName, logo, siteName } } = this.props;
		let checkInDate = checkIn != null ? moment(checkIn).format('ddd, Do MMM, YYYY') : '';
		return (
			<Layout>
				<Header
					color="rgb(255, 90, 95)"
					backgroundColor="#F7F7F7"
					logo={logo}
					siteName={siteName}
				/>
				<div>
					<Table width="100%" >
						<TBody>
							<TR>
								<TD style={textStyle}>
									<EmptySpace height={20} />
									<div>
										Hi {guestName},
									</div>
									<EmptySpace height={20} />
									<div>
										We regret to inform that your booking with {hostName}
										{' '}({confirmationCode}) that was scheduled on {checkInDate} has been expired. You will be fully refunded and notified.
									</div>
									<EmptySpace height={40} />
									<EmailSignature siteName={siteName} />
								</TD>
							</TR>
						</TBody>
					</Table>
					<EmptySpace height={40} />
				</div>
				<Footer siteName={siteName} />
				<EmptySpace height={20} />
			</Layout>
		);
	}
}

export default BookingExpiredGuest;

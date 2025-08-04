import React from 'react';
import PropTypes from 'prop-types';
import Layout from '../layouts/Layout';
import Header from '../modules/Header';
import Body from '../modules/Body';
import Footer from '../modules/Footer';
import EmptySpace from '../modules/EmptySpace';
import EmailSignature from './EmailSignature';
import { COMMON_TEXT_COLOR } from '../../../constants/index';

class BanStatusServiceStatusUnBanned extends React.Component {

	static propTypes = {
		content: PropTypes.shape({
			userMail: PropTypes.string.isRequired,
			siteName: PropTypes.string.isRequired,
		}).isRequired
	};

	render() {

		const textStyle = {
			color: COMMON_TEXT_COLOR,
			backgroundColor: '#F7F7F7',
			fontFamily: 'Arial',
			fontSize: '16px',
			padding: '35px'
		};
		const { content: { userName, userMail, adminMail, logo, siteName } } = this.props;
		let mailTo = 'mailto:' + adminMail;

		return (
			<Layout>
				<Header
					color="rgb(255, 90, 95)"
					backgroundColor="#F7F7F7"
					logo={logo}
					siteName={siteName}
				/>
				<Body textStyle={textStyle}>
					<div>
						Dear {userName},
					</div>
					<EmptySpace height={20} />
					<div>
						Your account has been unblocked now, you can log in and explore the website.
					</div>
					<EmptySpace height={20} />
					<div>
						Please get in touch with <a href={mailTo}>{adminMail}</a> if you have any questions.
					</div>
					<EmptySpace height={40} />
					<EmailSignature siteName={siteName} />
				</Body>
				<Footer siteName={siteName} />
				<EmptySpace height={20} />
			</Layout>
		);
	}

}

export default BanStatusServiceStatusUnBanned;
import React from 'react';
import PropTypes from 'prop-types';
import Layout from '../layouts/Layout';
import Header from '../modules/Header';
import Body from '../modules/Body';
import Footer from '../modules/Footer';
import EmptySpace from '../modules/EmptySpace';
import EmailSignature from './EmailSignature';
import { COMMON_TEXT_COLOR } from '../../../constants/index';

class PaymentVoucher extends React.Component {
    static propTypes = {
        content: PropTypes.shape({
            transactionId: PropTypes.string.isRequired,
            amount: PropTypes.string.isRequired,
            date: PropTypes.string.isRequired,
            status: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            siteName: PropTypes.string.isRequired,
        })
    };

    render() {
        const textStyle = {
            color: COMMON_TEXT_COLOR,
            backgroundColor: '#F7F7F7',
            fontFamily: 'Arial',
            fontSize: '16px',
            padding: '35px'
        };

        const { content: { transactionId, amount, date, status, description, logo, siteName } } = this.props;

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
                        <h2>Payment Voucher Details</h2>
                        <EmptySpace height={20} />
                        <div>
                            <p><strong>Transaction ID:</strong> {transactionId}</p>
                            <p><strong>Amount:</strong> {amount}</p>
                            <p><strong>Date:</strong> {date}</p>
                            <p><strong>Status:</strong> {status}</p>
                            <p><strong>Description:</strong> {description}</p>
                        </div>
                        <EmptySpace height={30} />
                        <EmailSignature siteName={siteName} />
                    </div>
                </Body>
                <Footer siteName={siteName} />
                <EmptySpace height={20} />
            </Layout>
        );
    }
}

export default PaymentVoucher; 
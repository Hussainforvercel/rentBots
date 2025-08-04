import React from 'react';
import PropTypes from 'prop-types';
import Layout from '../layouts/Layout';
import Header from '../modules/Header';
import Body from '../modules/Body';
import Footer from '../modules/Footer';
import EmptySpace from '../modules/EmptySpace';
import EmailSignature from './EmailSignature';
import { COMMON_TEXT_COLOR } from '../../../constants/index';

class ContactEmail extends React.Component {

    static propTypes = {
        content: PropTypes.shape({
            contactMessage: PropTypes.string.isRequired,
            email: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            phoneNumber: PropTypes.any.isRequired,
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
        const { content: { contactMessage, email, name, phoneNumber, logo, siteName } } = this.props;

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
                        Hi Admin,
                    </div>
                    <EmptySpace height={20} />
                    <div>
                        A visitor/user wants to contact. Below are their contact information,
                    </div>
                    <EmptySpace height={20} />
                    <div>
                        Name: {name}<br /><br />
                        Email: {email}<br /><br />
                        Contact Number: {phoneNumber}<br /><br />
                        Message: {contactMessage}<br />
                    </div>
                    <EmptySpace height={30} />
                    <EmailSignature siteName={siteName} />
                </Body>
                <Footer siteName={siteName} />
                <EmptySpace height={20} />
            </Layout>
        );
    }

}

export default ContactEmail;
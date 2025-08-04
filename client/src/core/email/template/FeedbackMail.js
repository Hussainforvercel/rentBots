import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Layout from '../layouts/Layout';
import Header from '../modules/Header';
import Body from '../modules/Body';
import Footer from '../modules/Footer';
import EmptySpace from '../modules/EmptySpace';
import EmailSignature from './EmailSignature';
const url = process.env.SITE_URL;
const profilePhotouploadDir = process.env.PROFILE_PHOTO_UPLOAD_DIR; // User Profile Photos Upload Directory
import { COMMON_TEXT_COLOR } from '../../../constants/index';

class FeedbackMail extends React.Component {

    static propTypes = {
        content: PropTypes.shape({
            message: PropTypes.string.isRequired,
            type: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
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

        const textBold = {
            fontWeight: 'bold'
        };

        const { content: { message, type, name, logo, siteName } } = this.props;
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
                        {name} has sent you a {type} that {message}.
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

export default FeedbackMail;
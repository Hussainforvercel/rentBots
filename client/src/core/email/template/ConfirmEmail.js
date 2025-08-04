import React from 'react';
import PropTypes from 'prop-types';
import Layout from '../layouts/Layout';
import Header from '../modules/Header';
import Body from '../modules/Body';
import Footer from '../modules/Footer';
import EmptySpace from '../modules/EmptySpace';
import EmailSignature from './EmailSignature';
const url = process.env.SITE_URL;
const profilePhotouploadDir = process.env.PROFILE_PHOTO_UPLOAD_DIR; // User Profile Photos Upload Directory

import { COMMON_COLOR, COMMON_TEXT_COLOR } from '../../../constants/index';

class ConfirmEmail extends React.Component {

  static propTypes = {
    content: PropTypes.shape({
      token: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      siteName: PropTypes.string.isRequired
    })
  };

  render() {
    const buttonStyle = {
      margin: 0,
      fontFamily: 'Arial',
      padding: '10px 16px',
      textDecoration: 'none',
      borderRadius: '2px',
      border: '1px solid',
      textAlign: 'center',
      verticalAlign: 'middle',
      fontWeight: 'normal',
      fontSize: '18px',
      whiteSpace: 'nowrap',
      background: '#ffffff',
      borderColor: COMMON_COLOR,
      backgroundColor: COMMON_COLOR,
      color: '#ffffff',
      borderTopWidth: '1px',
    };

    const textStyle = {
      color: COMMON_TEXT_COLOR,
      backgroundColor: '#F7F7F7',
      fontFamily: 'Arial',
      fontSize: '16px',
      padding: '35px'
    };
    const { content: { token, email, name, logo, siteName } } = this.props;
    let verificationURL = url + `/user/verification?confirm=${token}&email=${email}`;
    let firstName = name.charAt(0).toUpperCase() + name.slice(1);

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
            Hi {firstName},
          </div>
          <EmptySpace height={20} />
          <div>
            Welcome to {siteName}! In order to get started, you need to confirm your email address.
          </div>
          <EmptySpace height={40} />
          <div>
            <a style={buttonStyle} href={verificationURL}>Confirm your email</a>
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

export default ConfirmEmail;
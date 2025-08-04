import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Table, TBody, TR, TD } from 'oy-vey';
import Layout from '../layouts/Layout';
import Header from '../modules/Header';
import Body from '../modules/Body';
import Footer from '../modules/Footer';
import EmptySpace from '../modules/EmptySpace';
import EmailSignature from './EmailSignature';
import { COMMON_COLOR, COMMON_TEXT_COLOR } from '../../../constants/index';
const url = process.env.SITE_URL;
class BookingRequestGuest extends React.Component {

  static propTypes = {
    content: PropTypes.shape({
      confirmationCode: PropTypes.number.isRequired,
      hostName: PropTypes.string.isRequired,
      guestName: PropTypes.string.isRequired,
      checkIn: PropTypes.string.isRequired,
      listTitle: PropTypes.string.isRequired,
      threadId: PropTypes.number.isRequired,
      siteName: PropTypes.string.isRequired
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

    const btnCenter = {
      textAlign: 'center'
    }

    const buttonStyle = {
      margin: 0,
      fontFamily: 'Arial',
      padding: '10px 16px',
      textDecoration: 'none',
      borderRadius: '2px',
      border: '1px solid',
      textAlign: 'center',
      verticalAlign: 'middle',
      fontWeight: 'bold',
      fontSize: '18px',
      whiteSpace: 'nowrap',
      background: '#ffffff',
      borderColor: COMMON_COLOR,
      backgroundColor: COMMON_COLOR,
      color: '#ffffff',
      borderTopWidth: '1px',

    }

    const { content: { guestName, listTitle, hostName, checkIn, threadId, confirmationCode, logo, siteName } } = this.props;
    let checkInDate = checkIn != null ? moment(checkIn).format('ddd, Do MMM, YYYY') : '';
    let messageURL = url + '/message/' + threadId + '/renter';

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
                    Your trip request({confirmationCode}) starting on {checkInDate} has been sent to your car owner {hostName}. You will
                    hear from them within 24 hours.
                  </div>
                  <EmptySpace height={40} />
                  <div style={btnCenter}>
                    <a href={messageURL} style={buttonStyle}>Message {hostName}</a>
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

export default BookingRequestGuest;
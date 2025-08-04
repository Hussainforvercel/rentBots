import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './StaticPageManagement.css';
import CommonTable from '../../CommonTable/CommonTable';
import Link from '../../../components/Link';

// Translation
import messages from '../../../locale/messages';
class StaticPageManagement extends React.Component {

  constructor(props) {
    super(props);
  }

  thead = () => {
    const { formatMessage } = this.props.intl;
    return [
      { data: formatMessage(messages.idLabel) },
      { data: formatMessage(messages.pageName) },
      { data: formatMessage(messages.preview) },
      { data: formatMessage(messages.editLabel) },
    ]
  };

  tbody = () => {
    const { formatMessage } = this.props.intl;

    const data = [
      {
        id: 1,
        text: formatMessage(messages.aboutUsLabel),
        url: '/about'
      },
      {
        id: 2,
        text: formatMessage(messages.trustSafety),
        url: '/safety'
      },
      {
        id: 4,
        text: formatMessage(messages.termsPrivacy),
        url: '/privacy'
      },
      {
        id: 5,
        text: formatMessage(messages.help),
        url: '/help'
      },
      {
        id: 6,
        text: formatMessage(messages.cookiePolicy),
        url: '/cookie-policy'
      }
    ]

    return data.map((value, key) => {
      return {
        id: key,
        data: [
          { data: value?.id },
          { data: value.text },
          {
            data: <a href={value.url} target={'_blank'}>
              {formatMessage(messages.preview)}
            </a>
          },
          {
            data: <Link to={"/siteadmin/edit/staticpage/" + (value?.id)}>
              {formatMessage(messages.editLabel)}
            </Link>
          },
        ]
      }
    })
  }


  render() {
    const { formatMessage } = this.props.intl;
    return (
      <div className={cx(s.pagecontentWrapper, 'pagecontentWrapperRTL')
      }>
        <CommonTable
          thead={this.thead}
          tbody={this.tbody}
          title={formatMessage(messages.staticPageManagement)}
        />
      </div >
    );
  }
}


export default injectIntl(withStyles(s)((StaticPageManagement)));
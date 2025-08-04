import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { graphql, compose } from 'react-apollo';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';
import Badge from 'react-bootstrap/lib/Badge';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cs from '../../components/commonStyle.css';

import InboxItem from './InboxItem';
import EmptyInbox from './EmptyInbox';
import Loader from '../Loader';
import CustomPagination from '../CustomPagination';

import UnreadCountQuery from './UnreadCount.graphql';
import GetAllThreadQuery from './AllThreadsQuery.graphql';
import messages from '../../locale/messages';

import s from './Inbox.css';

class Inbox extends React.Component {

  static propTypes = {
    formatMessage: PropTypes.any,
    allThreads: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      GetAllThreads: PropTypes.shape({
        count: PropTypes.number.isRequired,
        threadsData: PropTypes.arrayOf(PropTypes.shape({
          id: PropTypes.number.isRequired,
          listData: PropTypes.shape({
            city: PropTypes.string.isRequired,
            state: PropTypes.string.isRequired,
            country: PropTypes.string.isRequired,
          }),
          guestProfile: PropTypes.shape({
            profileId: PropTypes.number.isRequired,
            picture: PropTypes.string,
            displayName: PropTypes.string.isRequired,
          }),
          hostProfile: PropTypes.shape({
            profileId: PropTypes.number.isRequired,
            picture: PropTypes.string,
            displayName: PropTypes.string.isRequired,
          }),
          threadItem: PropTypes.shape({
            type: PropTypes.string.isRequired,
            content: PropTypes.string,
            startDate: PropTypes.string,
            endDate: PropTypes.string,
            isRead: PropTypes.bool.isRequired,
            sentBy: PropTypes.string.isRequired,
            createdAt: PropTypes.string.isRequired,
          })
        }))
      }),
    }),
    UnreadCount: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      getUnreadCount: PropTypes.shape({
        hostCount: PropTypes.number.isRequired,
        guestCount: PropTypes.number.isRequired
      })
    })
  };

  static defaultProps = {
    allThreads: {
      loading: true,
      GetAllThreads: {
        count: null,
        threadsData: []
      }
    },
    UnreadCount: {
      loading: true,
      hostCount: null,
      guestCount: null
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      type: 'renter',
      currentPage: 1
    }
    this.changeType = this.changeType.bind(this);
    this.paginationData = this.paginationData.bind(this);
  }


  changeType(threadType) {
    const { allThreads: { refetch } } = this.props;
    let variables = {
      threadType,
      currentPage: 1
    };
    this.setState({ type: threadType, currentPage: 1 });
    refetch(variables);
  }

  paginationData(currentPage) {
    const { allThreads: { refetch } } = this.props;
    let variables = { currentPage };
    this.setState({ currentPage });
    refetch(variables);
  }

  render() {
    const { allThreads: { loading, GetAllThreads } } = this.props;
    const { UnreadCount: { getUnreadCount } } = this.props;
    const { formatMessage } = this.props.intl;
    const { type, currentPage } = this.state;
    let hostActive, guestActive, host, guest;
    if (type === 'owner') {
      hostActive = s.active;
    } else {
      guestActive = s.active;
    }
    if (getUnreadCount) {
      host = getUnreadCount.hostCount != null && getUnreadCount.hostCount > 0 ? getUnreadCount.hostCount : null;
      guest = getUnreadCount.guestCount != null && getUnreadCount.guestCount > 0 ? getUnreadCount.guestCount : null;
    }
    return (
      <Col xs={12} sm={12} md={12} lg={12}>
        <div className={cx(cs.spaceTop6, 'whiteBgColor', 'youcarsBg')}>
          <ul className={cx(cs.listContainer, cs.dFlex, cs.mobileFlexContainer)}>
            <li className={guestActive}>
              <a
                className={cx(s.tabItem, cs.listTabItem, 'tabLinkRTL', 'textWhite')}
                onClick={() => this.changeType('renter')}
              >
                <span className={cx(s.inboxHeadingText)}>
                  <FormattedMessage {...messages.traveling} />
                  {
                    guest != null && <Badge
                      className={cx(s.count, 'countRTL')}
                    >
                      {guest}
                    </Badge>
                  }
                </span>
              </a>
            </li>
            <li className={hostActive}>
              <a
                className={cx(s.tabItem, cs.listTabItem, 'tabLinkRTL', 'textWhite')}
                onClick={() => this.changeType('owner')}
              >
                <span className={cx(s.inboxHeadingText)}>
                  <FormattedMessage {...messages.hosting} />
                  {
                    host != null && <Badge
                      className={cx(s.count, 'countRTL')}
                    >
                      {host}
                    </Badge>
                  }
                </span>
              </a>
            </li>
          </ul>
          <Panel className={cx(cs.spaceTop4, cs.noMarginBottom, s.panelHeader)}>
            {
              loading && <Loader type={"text"} />
            }
            {
              !loading && GetAllThreads && GetAllThreads.threadsData && GetAllThreads.threadsData.length > 0
              && <ul className={cx(s.listLayout, 'listContainerRTL')}>
                {
                  GetAllThreads.threadsData.map((item, index) => {
                    if (item && item.guestProfile && item.hostProfile) {
                      return <InboxItem
                        key={index}
                        threadId={item.id}
                        type={type}
                        profileId={type === 'owner' ? item.guestProfile.profileId : item.hostProfile.profileId}
                        picture={type === 'owner' ? item.guestProfile.picture : item.hostProfile.picture}
                        displayName={type === 'owner' ? item.guestProfile.displayName : item.hostProfile.displayName}
                        firstName={type === 'owner' ? item.guestProfile.firstName : item.hostProfile.firstName}
                        content={item.threadItem && item.threadItem.content}
                        createdAt={item.threadItem && item.threadItem.createdAt}
                        city={item.listData && item.listData.city}
                        state={item.listData && item.listData.state}
                        country={item.listData && item.listData.country}
                        zipcode={item.listData && item.listData.zipcode}
                        startDate={item.threadItem && item.threadItem.startDate}
                        endDate={item.threadItem && item.threadItem.endDate}
                        status={item.threadItem && item.threadItem.type}
                        sentBy={item.threadItem && item.threadItem.sentBy}
                        read={item.threadItem && item.threadItem.isRead}
                        startTime={item.threadItem && item.threadItem.startTime}
                        endTime={item.threadItem && item.threadItem.endTime}
                      />
                    } else {
                      return <li />
                    }
                  })
                }
              </ul>
            }
            {
              !loading && GetAllThreads && GetAllThreads.threadsData && GetAllThreads.threadsData.length === 0
              && <EmptyInbox type={type} />
            }
            {
              GetAllThreads && GetAllThreads.threadsData && GetAllThreads.threadsData.length > 0
              && <div>
                <CustomPagination
                  total={GetAllThreads.count}
                  currentPage={currentPage}
                  defaultCurrent={1}
                  defaultPageSize={5}
                  change={this.paginationData}
                  paginationLabel={formatMessage(messages.messages)}
                />
              </div>
            }
          </Panel>
        </div>
      </Col>
    );
  }
}

export default compose(
  injectIntl,
  withStyles(s, cs),
  graphql(UnreadCountQuery, {
    name: 'UnreadCount',
    options: {
      ssr: false,
      pollInterval: 5000,
      fetchPolicy: 'network-only',
    }
  }),
  graphql(GetAllThreadQuery, {
    name: 'GetAllThreads',
    options: {
      ssr: false,
      pollInterval: 5000,
      fetchPolicy: 'network-only',
    }
  })
)(Inbox);



// import React from 'react';
// import PropTypes from 'prop-types';
// import { FormattedMessage, injectIntl } from 'react-intl';
// import { graphql, compose } from 'react-apollo';
// import Col from 'react-bootstrap/lib/Col';
// import Panel from 'react-bootstrap/lib/Panel';
// import Badge from 'react-bootstrap/lib/Badge';
// import cx from 'classnames';
// import withStyles from 'isomorphic-style-loader/lib/withStyles';
// import cs from '../../components/commonStyle.css';

// import InboxItem from './InboxItem';
// import EmptyInbox from './EmptyInbox';
// import Loader from '../Loader';
// import CustomPagination from '../CustomPagination';

// import UnreadCountQuery from './UnreadCount.graphql';
// import GetAllThreadQuery from './AllThreadsQuery.graphql';
// import messages from '../../locale/messages';

// import s from './Inbox.css';

// class Inbox extends React.Component {

//   static propTypes = {
//     formatMessage: PropTypes.any,
//     allThreads: PropTypes.shape({
//       loading: PropTypes.bool.isRequired,
//       GetAllThreads: PropTypes.shape({
//         count: PropTypes.number.isRequired,
//         threadsData: PropTypes.arrayOf(PropTypes.shape({
//           id: PropTypes.number.isRequired,
//           listData: PropTypes.shape({
//             city: PropTypes.string.isRequired,
//             state: PropTypes.string.isRequired,
//             country: PropTypes.string.isRequired,
//           }),
//           guestProfile: PropTypes.shape({
//             profileId: PropTypes.number.isRequired,
//             picture: PropTypes.string,
//             displayName: PropTypes.string.isRequired,
//           }),
//           hostProfile: PropTypes.shape({
//             profileId: PropTypes.number.isRequired,
//             picture: PropTypes.string,
//             displayName: PropTypes.string.isRequired,
//           }),
//           threadItem: PropTypes.shape({
//             type: PropTypes.string.isRequired,
//             content: PropTypes.string,
//             startDate: PropTypes.string,
//             endDate: PropTypes.string,
//             isRead: PropTypes.bool.isRequired,
//             sentBy: PropTypes.string.isRequired,
//             createdAt: PropTypes.string.isRequired,
//           })
//         }))
//       }),
//     }),
//     UnreadCount: PropTypes.shape({
//       loading: PropTypes.bool.isRequired,
//       getUnreadCount: PropTypes.shape({
//         hostCount: PropTypes.number.isRequired,
//         guestCount: PropTypes.number.isRequired
//       })
//     })
//   };

//   static defaultProps = {
//     allThreads: {
//       loading: true,
//       GetAllThreads: {
//         count: null,
//         threadsData: []
//       }
//     },
//     UnreadCount: {
//       loading: true,
//       hostCount: null,
//       guestCount: null
//     }
//   };

//   constructor(props) {
//     super(props);
//     this.state = {
//       type: 'renter',
//       currentPage: 1
//     }
//     this.changeType = this.changeType.bind(this);
//     this.paginationData = this.paginationData.bind(this);
//   }

//   changeType(threadType) {
//     const { allThreads: { refetch } } = this.props;
//     let variables = {
//       threadType,
//       currentPage: 1
//     };
//     this.setState({ type: threadType, currentPage: 1 });
//     refetch(variables);
//   }

//   paginationData(currentPage) {
//     const { allThreads: { refetch } } = this.props;
//     let variables = { currentPage };
//     this.setState({ currentPage });
//     refetch(variables);
//   }

//   render() {
//     const { allThreads: { loading, GetAllThreads } } = this.props;
//     const { UnreadCount: { getUnreadCount } } = this.props;
//     const { formatMessage } = this.props.intl;
//     const { type, currentPage } = this.state;
//     let hostActive, guestActive, host, guest;
//     if (type === 'owner') {
//       hostActive = s.active;
//     } else {
//       guestActive = s.active;
//     }
//     if (getUnreadCount) {
//       host = getUnreadCount.hostCount != null && getUnreadCount.hostCount > 0 ? getUnreadCount.hostCount : null;
//       guest = getUnreadCount.guestCount != null && getUnreadCount.guestCount > 0 ? getUnreadCount.guestCount : null;
//     }
//     return (
//       <Col xs={12} sm={12} md={12} lg={12}>
//         <div className={cx(cs.spaceTop6, 'whiteBgColor', 'youcarsBg')}>
//           <ul className={cx(cs.listContainer, cs.dFlex, cs.mobileFlexContainer)}>
//             <li className={guestActive}>
//               <a
//                 className={cx(s.tabItem, cs.listTabItem, 'tabLinkRTL', 'textWhite')}
//                 onClick={() => this.changeType('renter')}
//               >
//                 <span className={cx(s.inboxHeadingText)}>
//                   <FormattedMessage {...messages.traveling} />
//                   {
//                     guest != null && <Badge
//                       className={cx(s.count, 'countRTL')}
//                     >
//                       {guest}
//                     </Badge>
//                   }
//                 </span>
//               </a>
//             </li>
//             <li className={hostActive}>
//               <a
//                 className={cx(s.tabItem, cs.listTabItem, 'tabLinkRTL', 'textWhite')}
//                 onClick={() => this.changeType('owner')}
//               >
//                 <span className={cx(s.inboxHeadingText)}>
//                   <FormattedMessage {...messages.hosting} />
//                   {
//                     host != null && <Badge
//                       className={cx(s.count, 'countRTL')}
//                     >
//                       {host}
//                     </Badge>
//                   }
//                 </span>
//               </a>
//             </li>
//           </ul>
//           <Panel className={cx(cs.spaceTop4, cs.noMarginBottom, s.panelHeader)}>
//             {
//               loading && <Loader type={"text"} />
//             }
//             {
//               !loading && GetAllThreads && GetAllThreads.threadsData && GetAllThreads.threadsData.length > 0
//               && <ul className={cx(s.listLayout, 'listContainerRTL')}>
//                 {
//                   GetAllThreads.threadsData.map((item, index) => {
//                     if (item && item.guestProfile && item.hostProfile) {
//                       return <InboxItem
//                         key={index}
//                         threadId={item.id}
//                         type={type}
//                         profileId={type === 'owner' ? item.guestProfile.profileId : item.hostProfile.profileId}
//                         picture={type === 'owner' ? item.guestProfile.picture : item.hostProfile.picture}
//                         displayName={type === 'owner' ? item.guestProfile.displayName : item.hostProfile.displayName}
//                         firstName={type === 'owner' ? item.guestProfile.firstName : item.hostProfile.firstName}
//                         content={item.threadItem && item.threadItem.content}
//                         createdAt={item.threadItem && item.threadItem.createdAt}
//                         city={item.listData && item.listData.city}
//                         state={item.listData && item.listData.state}
//                         country={item.listData && item.listData.country}
//                         zipcode={item.listData && item.listData.zipcode}
//                         startDate={item.threadItem && item.threadItem.startDate}
//                         endDate={item.threadItem && item.threadItem.endDate}
//                         status={item.threadItem && item.threadItem.type}
//                         sentBy={item.threadItem && item.threadItem.sentBy}
//                         read={item.threadItem && item.threadItem.isRead}
//                         startTime={item.threadItem && item.threadItem.startTime}
//                         endTime={item.threadItem && item.threadItem.endTime}
//                       />
//                     } else {
//                       return <li />
//                     }
//                   })
//                 }
//               </ul>
//             }
//             {
//               !loading && GetAllThreads && GetAllThreads.threadsData && GetAllThreads.threadsData.length === 0
//               && <EmptyInbox type={type} />
//             }
//             {
//               GetAllThreads && GetAllThreads.threadsData && GetAllThreads.threadsData.length > 0
//               && <div>
//                 <CustomPagination
//                   total={GetAllThreads.count}
//                   currentPage={currentPage}
//                   defaultCurrent={1}
//                   defaultPageSize={5}
//                   change={this.paginationData}
//                   paginationLabel={formatMessage(messages.messages)}
//                 />
//               </div>
//             }
//           </Panel>
//         </div>
//       </Col>
//     );
//   }
// }

// export default compose(
//   injectIntl,
//   withStyles(s, cs),
//   graphql(UnreadCountQuery, {
//     name: 'UnreadCount',
//     options: {
//       ssr: false,
//       fetchPolicy: 'network-only', // Prevents polling and fetches only when necessary
//     }
//   }),
//   graphql(GetAllThreadQuery, {
//     name: 'GetAllThreads',
//     options: {
//       ssr: false,
//       fetchPolicy: 'network-only', // Prevents polling and fetches only when necessary
//     }
//   })
// )(Inbox);

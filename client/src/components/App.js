import React, { Children } from 'react';
import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl';
// import io from 'socket.io-client';
import moment from 'moment';
import { Provider as ReduxProvider } from 'react-redux';

import AsyncStripeProvider from './AsyncStripeProvider';
// import SocketProvider from './Socket/SocketProvider';
import LiveChatWidget from './LiveWidget.jsx';

import { payment, socketUrl } from '../config';
import { isRTL, generateMomentLocaleSettings } from '../helpers/formatLocale';

const ContextType = {
  // Enables critical path CSS rendering
  // https://github.com/kriasoft/isomorphic-style-loader
  insertCss: PropTypes.any.isRequired,
  // Integrate Redux
  // http://redux.js.org/docs/basics/UsageWithReact.html
  store: PropTypes.shape({
    subscribe: PropTypes.any.isRequired,
    dispatch: PropTypes.any.isRequired,
    getState: PropTypes.any.isRequired,
  }).isRequired,
  // Apollo Client
  client: PropTypes.object.isRequired,
  pathname: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  query: PropTypes.object,
  intl: PropTypes.object,
  ...ReduxProvider.childContextTypes,
};

/**
 * The top-level React component setting context (global) variables
 * that can be accessed from all the child components.
 *
 * https://facebook.github.io/react/docs/context.html
 *
 * Usage example:
 *
 *   const context = {
 *     history: createBrowserHistory(),
 *     store: createStore(),
 *   };
 *
 *   ReactDOM.render(
 *     <App context={context}>
 *       <Layout>
 *         <LandingPage />
 *       </Layout>
 *     </App>,
 *     container,
 *   );
 */
class App extends React.PureComponent {

  static propTypes = {
    context: PropTypes.shape(ContextType).isRequired,
    children: PropTypes.element.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      load: false
    };
  }

  static childContextTypes = ContextType;

  getChildContext() {
    return this.props.context;
  }

  componentDidMount() {
    const { context } = this.props;
    const store = context && context.store;
    if (store) {
      this.lastLocale = store.getState().intl.locale;
      this.unsubscribe = store.subscribe(() => {
        const state = store.getState();
        const { newLocale, locale } = state.intl;
        if (!newLocale && this.lastLocale !== locale) {
          this.lastLocale = locale;
          this.forceUpdate();
        }
      });
    }
    const locale = context && context.locale;

    moment.defineLocale(locale + '-dup', { // Updating moment locale 
      parentLocale: isRTL(locale) ? locale : 'en',
      preparse: function (string) {
        return string;
      },
      postformat: function (string) {
        return string;
      }
    });

    fetch('/api/site-settings/button-color')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.value) {
          console.log(data)
          document.documentElement.style.setProperty('--btn-primary-bg', data.value);
          document.documentElement.style.setProperty('--btn-secondary-hover-bg', data.value);
          document.documentElement.style.setProperty('--btn-primary-bg-hover', data.value);
          document.documentElement.style.setProperty('--btn-secondary-color', data.value);
          document.documentElement.style.setProperty('--btn-primaryBorder-hover-bg', data.value);
          document.documentElement.style.setProperty('--common-background-color', data.value);
          document.documentElement.style.setProperty('--btn-primaryBorder-color', data.value);
        }
      });

    this.setState({
      load: true
    })
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }

  render() {
    // NOTE: If you need to add or modify header, footer etc. of the app,
    // please do that inside the Layout component.
    const store = this.props.context && this.props.context.store;
    const state = store && store.getState();
    this.intl = (state && state.intl) || {};
    const { initialNow, locale, messages } = this.intl;
    const localeMessages = (messages && messages[locale]) || {};

    return (
      <AsyncStripeProvider apiKey={payment.stripe.publishableKey}>
        <IntlProvider
          initialNow={initialNow}
          locale={locale}
          messages={localeMessages}
          defaultLocale="en-US"
        >
          {/* <SocketProvider /> */}
          {React.Children.only(this.props.children)}
          {/* <LiveChatWidget /> */}
        </IntlProvider>
      </AsyncStripeProvider>
    );
  }

}

export default App;

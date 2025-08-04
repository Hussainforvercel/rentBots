import React from 'react';
import PropTypes from 'prop-types';
import serialize from 'serialize-javascript';
import { analytics } from '../config';
import { isRTL } from '../helpers/formatLocale';
import { ogImageuploadDir, url, faviconUploadDir } from '../config';
import { photosShow } from '../helpers/photosShow';

class Html extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string,
    styles: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      cssText: PropTypes.string.isRequired,
    }).isRequired),
    scripts: PropTypes.arrayOf(PropTypes.string.isRequired),
    // eslint-disable-next-line react/forbid-prop-types
    state: PropTypes.object,
    lang: PropTypes.string,
    children: PropTypes.string.isRequired,
  };

  static defaultProps = {
    styles: [],
    scripts: [],
    state: null,
    lang: 'en',
  };

  render() {
    const { title, description, styles, scripts, state, lang, children, image } = this.props;
    let bodyClassName, ogImage, defaultLogo, favIconPath;
    bodyClassName = isRTL(lang) ? 'rtl' : '';
    ogImage = state?.siteSettings?.data?.ogImage;
    defaultLogo = url + ogImageuploadDir?.replace('.', "") + 'small_' + ogImage;
    favIconPath = photosShow(faviconUploadDir);
    const metaKeyword = state?.siteSettings?.data?.metaKeyword;

    // Debug state and siteSettings
    console.log('Full State:', state);
    console.log('Site Settings Data:', state?.siteSettings?.data);
    console.log('All Settings:', state?.siteSettings?.data ? Object.keys(state.siteSettings.data) : 'No settings found');

    // Get LiveChat settings from state - check both site_settings and config_settings
    const liveChatEnabled = state?.siteSettings?.data?.showchat === '1' || state?.configSettings?.data?.showchat === '1';
    const liveChatScript = state?.siteSettings?.data?.livechat || state?.configSettings?.data?.livechat;

    console.log('LiveChat Debug:', {
      stateExists: !!state,
      siteSettingsExists: !!state?.siteSettings,
      configSettingsExists: !!state?.configSettings,
      dataExists: !!(state?.siteSettings?.data || state?.configSettings?.data),
      showchatValue: state?.siteSettings?.data?.showchat || state?.configSettings?.data?.showchat,
      livechatValue: state?.siteSettings?.data?.livechat || state?.configSettings?.data?.livechat,
      enabled: liveChatEnabled,
      script: liveChatScript
    });

    return (
      <html className="no-js" lang={lang}>
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta name="keywords" content={metaKeyword} />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:image" content={image ? image : defaultLogo} />
          <meta name="twitter:card" content="photo" />
          <meta name="twitter:image" content={image ? image : defaultLogo} />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={description} />
          <link rel="apple-touch-icon" href={`${favIconPath}apple-touch-icon.png`} />
          <link rel="apple-touch-icon" sizes="57x57" href={`${favIconPath}apple-icon-57x57.png`} />
          <link rel="apple-touch-icon" sizes="60x60" href={`${favIconPath}apple-icon-60x60.png`} />
          <link rel="apple-touch-icon" sizes="72x72" href={`${favIconPath}apple-icon-72x72.png`} />
          <link rel="apple-touch-icon" sizes="76x76" href={`${favIconPath}apple-icon-76x76.png`} />
          <link rel="apple-touch-icon" sizes="114x114" href={`${favIconPath}apple-icon-114x114.png`} />
          <link rel="apple-touch-icon" sizes="120x120" href={`${favIconPath}apple-icon-120x120.png`} />
          <link rel="apple-touch-icon" sizes="144x144" href={`${favIconPath}apple-icon-144x144.png`} />
          <link rel="apple-touch-icon" sizes="152x152" href={`${favIconPath}apple-icon-152x152.png`} />
          <link rel="apple-touch-icon" sizes="180x180" href={`${favIconPath}apple-icon-180x180.png`} />
          <link rel="icon" type="image/png" sizes="192x192" href={`${favIconPath}android-icon-192x192.png`} />
          <link rel="icon" type="image/png" sizes="32x32" href={`${favIconPath}favicon-32x32.png`} />
          <link rel="icon" type="image/png" sizes="96x96" href={`${favIconPath}favicon-96x96.png`} />
          <link rel="icon" type="image/png" sizes="16x16" href={`${favIconPath}favicon-16x16.png`} />
          <meta name="msapplication-TileImage" content={`${favIconPath}ms-icon-144x144.png`} />
          <link rel="manifest" href="/manifest.json" />
          <meta name="msapplication-TileColor" content="#ffffff" />
          <meta name="theme-color" content="#ffffff"></meta>
          <link rel="stylesheet" href="/css/bootstrap.min.css" />
          <link rel="stylesheet" type="text/css" href="/css/react-slick/slick.min.css" />
          <link rel="stylesheet" type="text/css" href="/css/react-slick/slick-theme.min.css" />
          <link rel="stylesheet" type="text/css" href="/css/react-swiper/swiper.css" />
          <link rel="stylesheet" type="text/css" href="/css/react-swiper/swiper.min.css" />
          <link rel="stylesheet" href="/css/app-common.css" />
          <link rel="stylesheet" href="/css/min/dropzone.min.css" />
          <link rel="stylesheet" media="print" href="/css/print.css" />
          <link rel="stylesheet" type="text/css" href="/css/quill-snow.css" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.5.0/css/swiper.css"></link>
          <link rel="stylesheet" type="text/css" href="/css/react-tab-scrollable/tab-scroll.css" />
          <link rel="stylesheet" href="/css/rtl.css" />
          {
            isRTL(lang) && <link rel="stylesheet" id="rtl-style" href={'/css/app-rtl.min.css'} />
          }

          {styles.map(style =>
            <style
              key={style.id}
              id={style.id}
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: style.cssText }}
            />,
          )}
   {/* document.documentElement.style.setProperty('--btn-secondary-hover-bg', '${state.siteSettings.data.ButtonColor}');
                  document.documentElement.style.setProperty('--btn-secondary-color', '${state.siteSettings.data.ButtonColor}');
                  document.documentElement.style.setProperty('--btn-primaryBorder-hover-bg', '${state.siteSettings.data.ButtonColor}');
                  document.documentElement.style.setProperty('--btn-primaryBorder-color', '${state.siteSettings.data.ButtonColor}'); */}
          {/* Dynamic button color from site settings */}
          {state?.siteSettings?.data?.ButtonColor && (
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  document.documentElement.style.setProperty('--btn-primary-bg', '${state.siteSettings.data.ButtonColor}');
               
                `
              }}
            />
          )}

          {liveChatEnabled && liveChatScript && (
            <script
              dangerouslySetInnerHTML={{
                __html: liveChatScript.trim()
              }}
            />
          )}
        </head>
        <body className={bodyClassName}>
          <div
            id="app"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: children }}
          />
          {state && (
            <script
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html:
                  `window.APP_STATE=${serialize(state, { isJSON: true })}`
              }}
            />
          )}
          {scripts.map(script => <script key={script} src={script} />)}
          {analytics.google.trackingId &&
            <script
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html:
                  `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date());` +
                  `gtag('config', '${analytics.google.trackingId}');`
              }}
            />
          }
          {analytics.google.trackingId &&
            <script src={`https://www.googletagmanager.com/gtag/js?id=${analytics.google.trackingId}`} async defer />
          }
          {/* <script id="stripe-js" src="https://js.stripe.com/v3/" async></script> */}
        </body>
      </html>
    );
  }
}

export default Html;

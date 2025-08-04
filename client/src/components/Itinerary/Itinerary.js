import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import moment from 'moment';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

// Components
import Avatar from '../Avatar';
import CurrencyConverter from '../CurrencyConverter';
import ListCoverPhoto from '../ListCoverPhoto';
import Link from '../Link';
import ListNotFound from '../../routes/listNotFound/ListNotFound';
import NotFound from '../../routes/notFound/NotFound';

import { generateTime } from '../Receipt/helper';
import { formatTime } from '../../helpers/formatting';

// Locale
import messages from '../../locale/messages';

//Images
import Arrow from '/public/siteImages/rightSideArrow.svg';
import arrowIcon from '/public/SiteIcons/paymentArrow.svg';
import steeringIcon from '/public/SiteIcons/steeringIcon.svg';
import starIcon from '/public/SiteIcons/star.svg';
import Faq from '../Receipt/question.svg';

import s from './Itinerary.css';
import cs from '../../components/commonStyle.css';

function tryFixJsonString(str) {
  if (typeof str !== 'string') return str;
  let fixed = str.trim();
  // Remove trailing commas before closing brackets
  fixed = fixed.replace(/,\s*([}\]])/g, '$1');
  // Close open array
  const openArr = (fixed.match(/\[/g) || []).length;
  const closeArr = (fixed.match(/\]/g) || []).length;
  if (openArr > closeArr) {
    fixed += ']'.repeat(openArr - closeArr);
  }
  // Close open object
  const openObj = (fixed.match(/{/g) || []).length;
  const closeObj = (fixed.match(/}/g) || []).length;
  if (openObj > closeObj) {
    fixed += '}'.repeat(openObj - closeObj);
  }
  return fixed;
}

class Itinerary extends React.Component {
  static propTypes = {
    formatMessage: PropTypes.any,
    data: PropTypes.shape({
      id: PropTypes.number.isRequired,
      listId: PropTypes.number.isRequired,
      checkIn: PropTypes.string.isRequired,
      checkOut: PropTypes.string.isRequired,
      total: PropTypes.number.isRequired,
      guestServiceFee: PropTypes.number.isRequired,
      currency: PropTypes.string.isRequired,
      confirmationCode: PropTypes.number.isRequired,
      reservationState: PropTypes.string.isRequired,
      isHourly: PropTypes.bool,
      megasoftVoucher: PropTypes.string,
      listData: PropTypes.shape({
        title: PropTypes.string.isRequired,
        street: PropTypes.string.isRequired,
        city: PropTypes.string.isRequired,
        state: PropTypes.string.isRequired,
        country: PropTypes.string.isRequired,
        zipcode: PropTypes.string.isRequired,
        reviewsCount: PropTypes.number.isRequired,
        reviewsStarRating: PropTypes.number.isRequired,
        listingData: PropTypes.shape({
          checkInStart: PropTypes.string.isRequired,
          checkInEnd: PropTypes.string.isRequired
        }),
        coverPhoto: PropTypes.number,
        listPhotos: PropTypes.arrayOf({
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired
        }),
      }),
      messageData: PropTypes.shape({
        id: PropTypes.number.isRequired
      }),
      hostData: PropTypes.shape({
        profileId: PropTypes.number.isRequired,
        firstName: PropTypes.string.isRequired,
        picture: PropTypes.string.isRequired
      })
    })
  };

  static defaultProps = {
    data: null
  };

  render() {
    const { data } = this.props;
    const { formatMessage } = this.props.intl;
    const { userId } = this.props;

    if (data === null) {
      return <> <FormattedMessage {...messages.errorMessage} /> </>;
    } else if (data.listData === null) {
      return <ListNotFound />;
    } else if (data.paymentState !== "completed") {
      return <NotFound />
    } else {
      const { data, data: { startTime, endTime, listTitle, id, listId, checkIn, checkOut,megasoftVoucher,isHourly, total, guestServiceFee, currency, confirmationCode, reservationState, hostId, guestId, basePrice, delivery, discount, discountType, dayDifference } } = this.props;
      const { data: { hostData: { profileId, firstName, picture, createdAt } } } = this.props;
      const { data: { listData: { title, street, city, state, country, zipcode } } } = this.props;
      const { data: { listData: { coverPhoto, listPhotos, reviewsCount, reviewsStarRating, settingsData, transmission } } } = this.props;
      console.log("🚀 ~ Itinerary ~ render ~ coverPhoto:", coverPhoto,listPhotos)
      const { data: { listData: { listingData: { checkInStart, checkInEnd } } } } = this.props;
      const { data: { messageData, securityDeposit, bookingSpecialPricing } } = this.props;

      let carType, transmissionLabel, isSpecialPricingAssinged, checkInDate, checkOutDate, formattedStartTime, formattedEndTime;
      let checkInTime, checkOutTime, isAverage = 0, dayPrice = 0, isDayTotal = 0;

      carType = settingsData && settingsData.length > 0 && settingsData[0].listsettings.itemName;
      transmission == '1' ? transmissionLabel = formatMessage(messages.Automatic) : transmissionLabel = formatMessage(messages.Manuall);
      isSpecialPricingAssinged = (bookingSpecialPricing && bookingSpecialPricing.length > 0) ? true : false;
      checkInDate = checkIn ? moment(checkIn).utc().format('ddd, MMM DD, YYYY ') : '';
      checkOutDate = checkOut ? moment(checkOut).utc().format('ddd, MMM DD, YYYY ') : '';

      if (isSpecialPricingAssinged) {
        bookingSpecialPricing && bookingSpecialPricing.map((item, index) => {
          dayPrice = dayPrice + Number(item.isSpecialPrice);
        });
      } else {
        dayPrice = basePrice * dayDifference;
      }

      if (checkInStart === 'Flexible') {
        checkInTime = formatMessage(messages.flexibleCheckIn);
      } else {
        checkInTime = generateTime(checkInStart);
      }

      if (checkInEnd === 'Flexible') {
        checkOutTime = formatMessage(messages.flexibleCheckOut);
      } else {
        checkOutTime = generateTime(checkInEnd);
      }

      let subTotal = basePrice * dayDifference;
      let subTotalWithSecurityDeposit = total + guestServiceFee + securityDeposit;
      let starRatingValue = 0;
      if (reviewsCount > 0 && reviewsStarRating > 0) {
        starRatingValue = Math.round(reviewsStarRating / reviewsCount)
      }

      let isHost = false;
      if (userId === hostId) {
        isHost = true;
      }

      formattedStartTime = formatTime(startTime);
      formattedEndTime = formatTime(endTime);

      const hourDiff = endTime - startTime;
      const hourlyDifference = hourDiff >= 0 ? hourDiff : (24 - startTime + endTime);
      console.log("testing",hourlyDifference,isHourly,megasoftVoucher)
      let joinedDate = createdAt != null ? moment(createdAt).format("MMM, YYYY") : '';

      isAverage = Number(dayPrice) / Number(dayDifference);
      isDayTotal = isAverage.toFixed(2) * dayDifference;
      dayPrice = isDayTotal;
      return (
        <Grid fluid className={s.container}>
          <Row className={cs.positionRelative}>
            <Col lg={7} sm={12} md={7} xs={12} className={cx(cs.spaceTop5, 'paymentDetailsPadding')}>
              {
                reservationState === "approved" && <h2 className={cx(cs.commonTitleText, cs.paddingBottom1, cs.fontWeightBold)}>
                  <FormattedMessage {...messages.itinerayTitle} />
                </h2>
              }
              <h4 className={cx(cs.commonContentText, cs.fontWeightNormal)}>
                <FormattedMessage {...messages.confirmationCode} />{' '}
                <span>{'#'}{confirmationCode}</span>
              </h4>
              <hr className={cx(cs.listingHorizoltalLine, cs.spaceBottom4, cs.spaceTop4)} />
              {
                !isHost && <>
                  <div className={cx(s.avatarImage, cs.paddingBottom4)}>
                    <Avatar
                      source={picture}
                      height={80}
                      width={80}
                      className={cs.profileAvatarLink}
                      withLink
                      profileId={profileId}
                    />
                    <div className={cx(s.textSection, 'viewListingTextSectionRTL')}>
                      <h5 className={cx(cs.commonSubTitleText, cs.fontWeightBold, cs.paddingBottom1)}>
                        <FormattedMessage {...messages.hostedBy} />{' '}
                        <a href={"/users/show/" + profileId} target={'_blank'} className={cx(cs.reviewTitleLink, cs.commonContentText)}>
                          <span className={cs.siteLinkColor}>{firstName}</span>
                        </a>
                      </h5>
                      <h6 className={cx(cs.commonContentText, cs.fontWeightNormal, cs.paddingBottom1)}><FormattedMessage {...messages.joinedIn} /> {joinedDate}</h6>
                      {messageData && <Link to={"/message/" + messageData.id + "/renter"} className={cx(cs.siteLinkColor, cs.commomLinkborderBottom, cs.textDecorationNone, cs.fontWeightMedium)}>
                        <FormattedMessage {...messages.messageHost} />
                        <img src={Arrow} className={cx(cs.blueLeftArrow, 'loginArrowRTL')} />
                      </Link>}
                    </div>
                  </div>
                </>
              }
              <div className={cx(s.boxSection, cs.spaceBottom4)}>
                <div className={cx(s.displayFlexDate, cs.paddingBottom3, s.displayFlexDateMobile)}>
                  <h4 className={cx(cs.commonTotalText, cs.fontWeightBold)}>
                    <FormattedMessage {...messages.billing} />
                  </h4>
                  <Link to={"/users/trips/receipt/" + id} className={cx(cs.siteLinkColor, cs.commomLinkborderBottom, cs.textDecorationNone, cs.fontWeightMedium)}>
                    <FormattedMessage {...messages.viewReceipt} />
                    <img src={Arrow} className={cx(cs.blueLeftArrow, 'loginArrowRTL')} />
                  </Link>
                </div>
                <h4 className={cx(cs.commonMediumText, cs.fontWeightNormal, s.displayFlexDate, s.displayFlexDateMobile)}>
                  <div className={cs.dFlex}>
                    <div className={s.specialPriceIcon}>
                      {
                        isSpecialPricingAssinged &&
                        <span className={s.iconSection}>
                          <img src={Faq} className={cx(s.faqImage, 'faqImageRTL')} />
                        </span>
                      }
                      <div className={cx(s.toolTip, s.toolTipRelativeSection, 'toolTipRelativeSectionRTL', 'itneraryTipRTL')}>
                        <FormattedMessage {...messages.averageRate} />
                      </div>
                    </div>
                    <span>
                      <CurrencyConverter
                        amount={basePrice}
                        from={currency}
                      />
                      <span className={s.billingArrow}>x</span>
                      {
                        isHourly ?
                        <>
                        {hourlyDifference} {hourlyDifference > 1 ? "Hour" :"Hours"}
                        </>
                        :
                        <>
                        {dayDifference} {dayDifference > 1 ? formatMessage(messages.nights) : formatMessage(messages.night)}
                        </>

                      }
                    </span>
                  </div>
                  {
                           isHourly ?
                           <>
                             <CurrencyConverter
                    amount={dayPrice*hourlyDifference}
                    from={currency}
                  />
                           </>
                  
                :
                <>
                  <CurrencyConverter
                    amount={dayPrice}
                    from={currency}
                  />
                </>
                }
                
                </h4>
                <hr className={cx(cs.listingHorizoltalLine, cs.spaceBottom2, cs.spaceTop2)} />
                {delivery > 0 && <><h5 className={cx(cs.commonContentText, cs.fontWeightNormal, s.displayFlexDate, s.displayFlexDateMobile)}>
                  <FormattedMessage {...messages.cleaningFee} />
                  <CurrencyConverter
                    amount={delivery}
                    from={currency}
                  />
                </h5>
                  <hr className={cx(cs.listingHorizoltalLine, cs.spaceBottom2, cs.spaceTop2)} />
                </>
                }
                {discount > 0 && <><h5 className={cx(cs.commonContentText, cs.fontWeightNormal, s.displayFlexDate, s.displayFlexDateMobile)}>
                  {discountType}
                  <span className={s.discountColor}>{"-"}<CurrencyConverter
                    amount={discount}
                    from={currency}
                  /></span>
                </h5>
                  <hr className={cx(cs.listingHorizoltalLine, cs.spaceBottom2, cs.spaceTop2)} />
                </>
                }
                {guestServiceFee > 0 && <><h5 className={cx(cs.commonContentText, cs.fontWeightNormal, s.displayFlexDate, s.displayFlexDateMobile)}>
                  <FormattedMessage {...messages.serviceFee} />
                  <CurrencyConverter
                    amount={guestServiceFee}
                    from={currency}
                  />
                </h5>
                  <hr className={cx(cs.listingHorizoltalLine, cs.spaceBottom2, cs.spaceTop2)} />
                </>
                }
                {securityDeposit > 0 && <><h5 className={cx(cs.commonContentText, cs.fontWeightNormal, s.displayFlexDate, s.displayFlexDateMobile)}>
                  <FormattedMessage {...messages.securityDeposit} />
                  <CurrencyConverter
                    amount={securityDeposit}
                    from={currency}
                  />
                </h5>
                  <hr className={cx(cs.listingHorizoltalLine, cs.spaceBottom2, cs.spaceTop2)} />
                </>
                }
                <h6 className={cx(cs.commonContentText, cs.fontWeightBold, s.displayFlexDate, s.displayFlexDateMobile)}>
                  <FormattedMessage {...messages.totalPaid} />
                  <CurrencyConverter
                    amount={subTotalWithSecurityDeposit}
                    from={currency}
                  />
                </h6>
                {megasoftVoucher && (() => {
                  try {
                    let parsed;
                    try {
                      parsed = typeof megasoftVoucher === 'string' ? JSON.parse(megasoftVoucher) : megasoftVoucher;
                    } catch (e) {
                      const fixed = tryFixJsonString(megasoftVoucher);
                      try {
                        parsed = JSON.parse(fixed);
                      } catch (e2) {
                        return (
                          <div style={{ background: '#f7f7f7', border: '1px solid #ddd', borderRadius: 6, padding: 12, margin: '16px 0', wordBreak: 'break-all' }}>
                            <strong>Voucher Details:</strong>
                            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: 13 }}>{megasoftVoucher}</pre>
                          </div>
                        );
                      }
                    }
                    if (typeof parsed === 'object' && parsed !== null) {
                      const fieldOrder = [
                        'control', 'codigo', 'descripcion', 'vtid', 'seqnum', 'authid', 'authname', 'factura', 'referencia', 'terminal', 'lote', 'rifba', 'monto', 'fecha', 'hora', 'cuenta', 'pan', 'aprobacion', 'status', 'tarjeta', 'banco', 'cliente', 'telefono', 'email', 'cedula', 'tipo', 'moneda', 'bancoDestino', 'bancoOrigen', 'cuentaDestino', 'cuentaOrigen', 'comercio', 'pos', 'c2p', 'p2c', 'zelle', 'zelleRef', 'zelleName', 'zelleEmail', 'zellePhone', 'zelleBank', 'zelleDate', 'zelleTime', 'zelleAmount', 'zelleStatus', 'zelleControl', 'zelleTerminal', 'zelleLote', 'zelleFactura', 'zelleAprobacion', 'zelleDescripcion', 'zelleCodigo', 'zelleSeqnum', 'zelleAuthid', 'zelleAuthname', 'zelleRifba', 'zelleMonto', 'zelleCuenta', 'zellePan', 'zelleCliente', 'zelleCedula', 'zelleTipo', 'zelleMoneda', 'zelleBancoDestino', 'zelleBancoOrigen', 'zelleCuentaDestino', 'zelleCuentaOrigen', 'zelleComercio', 'zellePos', 'zelleC2p', 'zelleP2c'
                      ];
                      const shown = new Set();
                      return (
                        <div style={{ background: '#f7f7f7', border: '1px solid #ddd', borderRadius: 6, padding: 12, margin: '16px 0', wordBreak: 'break-all' }}>
                          <strong>Voucher Details:</strong>
                          <div style={{ fontSize: 13, marginTop: 8 }}>
                            {fieldOrder.map(key => {
                              if (key === 'voucher') return null;
                              if (parsed[key] !== undefined) {
                                shown.add(key);
                                let value = parsed[key];
                                if (Array.isArray(value)) value = value.join(', ');
                                return (
                                  <div key={key} style={{ marginBottom: 4 }}>
                                    <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
                                  </div>
                                );
                              }
                              return null;
                            })}
                            {Object.keys(parsed).filter(key => !shown.has(key) && key !== 'voucher').map(key => {
                              let value = parsed[key];
                              if (Array.isArray(value)) value = value.join(', ');
                              return (
                                <div key={key} style={{ marginBottom: 4 }}>
                                  <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div style={{ background: '#f7f7f7', border: '1px solid #ddd', borderRadius: 6, padding: 12, margin: '16px 0', wordBreak: 'break-all' }}>
                          <strong>Voucher Details:</strong>
                          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: 13 }}>{megasoftVoucher}</pre>
                        </div>
                      );
                    }
                  } catch (e) {
                    return (
                      <div style={{ background: '#f7f7f7', border: '1px solid #ddd', borderRadius: 6, padding: 12, margin: '16px 0', wordBreak: 'break-all' }}>
                        <strong>Voucher Details:</strong>
                        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: 13 }}>{megasoftVoucher}</pre>
                      </div>
                    );
                  }
                })()}
              </div>
              <div className={s.boxSection}>
                <h4 className={cx(cs.commonTotalText, cs.fontWeightBold, cs.paddingBottom3)}>
                  <FormattedMessage {...messages.tripDetails} />
                </h4>
                <div className={s.displayFlexDate}>
                  <h5 className={cx(cs.commonContentText, cs.fontWeightBold)}>
                    <FormattedMessage {...messages.checkIn} />
                    <span className={cx(cs.commonMediumText, cs.fontWeightNormal, cs.displayBlock, cs.paddingBottom1, cs.paddingTop2)}>{checkInDate}</span>
                    <span className={cx(cs.commonMediumText, cs.fontWeightNormal)}>{formattedStartTime}</span>
                  </h5>
                  <img src={arrowIcon} className={cx(cs.dateArrowMargin, 'commonDateArrowRTLRotate')} />
                  <h5 className={cx(cs.commonContentText, cs.fontWeightBold)}>
                    <FormattedMessage {...messages.checkOut} />
                    <span className={cx(cs.commonMediumText, cs.fontWeightNormal, cs.displayBlock, cs.paddingBottom1, cs.paddingTop2)}>{checkOutDate}</span>
                    <span className={cx(cs.commonMediumText, cs.fontWeightNormal)}>{formattedEndTime}</span>
                  </h5>
                </div>
                <hr className={cx(cs.listingHorizoltalLine, cs.spaceBottom3, cs.spaceTop3)} />
                <>
                  <h4 className={cx(cs.commonContentText, cs.fontWeightBold, cs.paddingBottom2)}>
                    <FormattedMessage {...messages.location} />
                  </h4>
                  <h6 className={cx(cs.commonMediumText, cs.fontWeightNormal, cs.paddingBottom1)}>
                    <span>{street}, </span>
                    <span>{city}, {state}, {zipcode}</span>
                    <span>{' '}{country}.</span>
                  </h6>
                  <a href={"/cars/" + listId} target={'_blank'} className={cx(cs.siteLinkColor, cs.commomLinkborderBottom, cs.textDecorationNone, cs.fontWeightMedium)}>
                    <FormattedMessage {...messages.viewListing} />
                    <img src={Arrow} className={cx(cs.blueLeftArrow, 'loginArrowRTL')} />
                  </a>
                </>
              </div>
            </Col>
            <Col lg={5} md={5} sm={12} xs={12} className={cx(cs.spaceTop7, cs.paymentSticky)}>
              <div className={cx(s.imgBgColor, s.boxSection)}>
                <div className={cx(cs.positionRelative, cs.displayBlock)}>
                  <a href={"/cars/" + listId} target={"_blank"}>
                    {listPhotos && listPhotos.length > 0 && (
                      <div 
                        className={cx(s.imageContent, cs.spaceBottom1)}
                        style={{
                          backgroundImage: `url(/images/upload/${listPhotos[0].name})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                          width: '100%',
                          height: '200px',
                          borderRadius: '8px'
                        }}
                      />
                    )}
                  </a>
                  <div className={cx(cs.positionAvatar, 'positionAvatarRTL', s.zIndex)}>
                    <Avatar
                      source={picture}
                      title={firstName}
                      className={cx(cs.profileAvatarLink, cs.profileAvatarLinkSmall)}
                      withLink
                      width={44}
                      height={44}
                      profileId={profileId}
                      linkClassName={cs.displayInlineBlock}
                    />
                  </div>
                </div>
                <>
                  <div className={cx(s.displayFlex, cs.spaceTop3)}>
                    <img src={steeringIcon} className={'commonIconSpace'} />
                    <h6 className={cx(cs.commonSmallText, cs.fontWeightNormal)}>
                      <span>{carType}</span>
                      <span className={cs.dotCss}></span>
                      <span>{transmissionLabel}</span>
                    </h6>
                  </div>
                  <a href={"/cars/" + listId} target={"_blank"} className={cx(cs.spaceTop1, cs.commonContentText, cs.siteTextColor, cs.displayBlock, cs.fontWeightBold)}>
                    {listTitle ? listTitle : title}
                  </a>
                  {starRatingValue > 0 && <div className={cx(cs.spaceTop1, cs.commonContentText, s.displayFlex)}>
                    <img src={starIcon} className={'searchHeaderIcon'} /> <span>{starRatingValue}</span>
                  </div>}
                </>
              </div>
            </Col>
          </Row>
        </Grid>
      );
    }
  }
}

const mapState = (state) => ({
  userId: state?.account?.data?.userId
});

const mapDispatch = {};

export default injectIntl(withStyles(s, cs)(connect(mapState, mapDispatch)(Itinerary)));
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import { photosShow } from '../../helpers/photosShow';
import {  } from '../../config';
import s from './MarketingBannerPopup.css';
import { homebanneruploadDir } from '../../config-sample';

const MarketingBannerPopup = ({ show, onHide, banner }) => {
  if (!banner) return null;
  
  const imagePath = photosShow(homebanneruploadDir) + banner.image;

  return (
    <Modal 
      show={show} 
      onHide={onHide}
      className={s.modal}
      centered
    >
      <Modal.Body className={s.modalBody}>
        <div 
          className={s.bannerContent}
          style={{ backgroundImage: `url(${imagePath})` }}
        >
          <div className={s.overlay}>
            <div className={s.textContent}>
              <h2 className={s.title}>{banner.title}</h2>
              <Button 
                className={cx(s.button, 'btnPrimary')}
                onClick={() => window.location.href = banner.link}
              >
                {banner.buttonText}
              </Button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default withStyles(s)(MarketingBannerPopup); 
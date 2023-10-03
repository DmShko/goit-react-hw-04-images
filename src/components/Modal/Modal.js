import { useState, useEffect } from 'react';

import { createPortal } from 'react-dom';

import mod from './Modal.module.css';

const modalRoot = document.querySelector('#modal-root');

export const Modal = ({ onClose, currentState, imageOpenID }) => {
  // close modal window by 'Escape'
  const driveModal = evt => {
    if (evt.code === 'Escape') onClose();
  };

  const [url, setURL] = useState(() => '');

  const componentMount = () => {
    window.addEventListener('keydown', driveModal);

    currentState.forEach(value => {
      if (value.id === imageOpenID) setURL(value.largeImageURL);
      // return url;
    });
  };

  useEffect(() => {
    componentMount();
    return () => {
      window.removeEventListener('keydown', driveModal);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // componentWillUnmount() {
  //   window.removeEventListener('keydown', this.driveModal);
  // }

  // close modal window by click on backdrob
  const clickBackdrob = evt => {
    if (evt.target === evt.currentTarget) onClose();
  };

  return createPortal(
    <div className={mod.overlay} onClick={clickBackdrob}>
      <div className={mod.modal}>
        <img src={url} alt="largeImage" />
      </div>
    </div>,
    modalRoot
  );
};

import { useState, useEffect } from 'react';

import { createPortal } from 'react-dom';

import mod from './Modal.module.css';

const modalRoot = document.querySelector('#modal-root');

export const Modal = ({ onClose, currentState, imageOpenID }) => {

  const [url, setURL ] = useState(() => componentMount());
  // state = {
  //   largeImageURL: '',
  // };

  const componentMount = () => {

    window.addEventListener('keydown', driveModal);

    currentState.forEach(value => {
      if (value.id === imageOpenID)
        setURL({ largeImageURL: value.largeImageURL });
      return url;
        // this.setState({ largeImageURL: value.largeImageURL });
    });
  }

  useEffect(() => {

    return () => {
      window.removeEventListener('keydown', driveModal);
    }
  }, [])
  // componentWillUnmount() {
  //   window.removeEventListener('keydown', this.driveModal);
  // }

  // close modal window by 'Escape'
  const driveModal = evt => {
    if (evt.code === 'Escape') onClose();
  };

  // close modal window by click on backdrob
  const clickBackdrob = evt => {
    if (evt.target === evt.currentTarget) onClose();
  };

  return createPortal(
    <div className={mod.overlay} onClick={clickBackdrob}>
      <div className={mod.modal}>
        <img src={URL.largeImageURL} alt="largeImage" />
      </div>
    </div>,
    modalRoot
  );
  
}

import { ImageGalleryItem } from 'components/ImageGalleryItem/ImageGalleryItem';

import im from './ImageGallery.module.css';

export const ImageGallery = ({ cardData, openModal }) => {
 
  return (
    <ul className={im.gallery}>
      {cardData.map(value => {
        return (
          <ImageGalleryItem
            key={value.id}
            dataItem={value}
            openModal={openModal}
          />
        );
      })}
    </ul>
  );
}


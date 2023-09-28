import it from './ImageGalleryItem.module.css';

export const ImageGalleryItem = ({ dataItem, openModal }) => {

const clickHandle = data => {
  openModal(data);
};

  return (
    <li
      className={it.item}
      onClick={() => this.clickHandle(dataItem.id)}
    >
      <img className={it.img} src={this.props.dataItem.webformatURL} alt="" />
    </li>
  );
}


import b from './/Button.module.css';

export const Button = ({ addImages, addInput }) => {
  const loadMore = () => {
    addImages(addInput);
  };

  return (
    <div className={b.buttonContainer}>
      <button
        type="button"
        id="loadButton"
        className={b.button}
        onClick={loadMore}
      >
        Load more
      </button>
    </div>
  );
}


import Notiflix from 'notiflix';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';

import { Button } from 'components/Button/Button';
import { ImageGallery } from 'components/ImageGallery/ImageGallery';
import { Modal } from 'components/Modal/Modal';
import { Searchbar } from 'components/Searchbar/Searchbar';
import { Loader } from 'components/Loader/Loader';


const API_KEY = '39566581-ca703ce31ea011c9b51d6d8b4';

export const App = () => {

  const [ pageCounter, setPageCounter ] = useState(0);
  const [ totalH, setTotalH ] = useState(0);
  const [ quantityCard, setQuantityCard ] = useState(12);
  const [ checkData, setCheckData ] = useState('');
  const [ inputData, setInputData ] = useState('');
  const [ cards, setCards ] = useState([]);
  const [ key, setKey ] = useState(true);
  const [ open, setOpen ] = useState(false);
  const [ temporary, setTemporary ] = useState(undefined);
  const [ fillingLevel, setFillingLevel ] = useState(
    function () {return Math.floor(totalH / quantityCard)});
  const [ activeButton, setActiveButton ] = useState(false);
  const [ load, setLoad] = useState(false);
  const [ cardID, setCardID ] = useState('');


  const prevInput = useRef();
  prevInput.current = inputData;

  // component did mount
  useEffect(() => {
    if (
      totalH <= quantityCard
    ) {
      
      changeState('quantityCard', 12);

       setActiveButton(false);
      
    }
  }, []);

  useEffect(value => {
    // scroll down, if 'activeButton' change
    if (value === activeButton) {
      // scroll only, if 'activeButton' change to 'true',
      // because, if 'activeButton' - false, she doesn't exist in DOM!!! It will be error!!
      if (activeButton === true) autoScroll('loadButton');
    }

    // visible button and hidden loader, when cards load
    if ((value === cards) && (
      totalH >= quantityCard
    )) {
      setLoad(false);
      setActiveButton(true);
    } 

    // if elementsSet.totalH <= elementsSet.quantityCard
    if ((value === cards) && (
      totalH <= quantityCard
    )) {
      setLoad(false);

      // if elementsSet.totalH <= elementsSet.quantityCard
      if (
        totalH <= quantityCard && totalH !== 0
      ) {
        
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
        
      }
    } 

    if (
      value === pageCounter &&
      pageCounter !== 0
    ) {
      // 'activeButton: false', that scroll worked in next event load cards,
      // because scroll react on change 'activeButton'
      setLoad(true);
      setActiveButton(false);

      // add last itteration, last part of totalH
      if (
        pageCounter === fillingLevel() &&
        totalH > quantityCard
      ) {
        // temporery value for 63's row
        setTemporary(fillingLevel() + 1);
        quantityCard(totalH - quantityCard * fillingLevel());
        
      }

      // control, when total quantity loaded images >= "data.totalHits"
      if (pageCounter > temporary) {

        changeState('quantityCard', 12);

        setLoad(false);
        setActiveButton(false);

        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
        return;
      }

      
      request(inputData);
    }

    // new input data !== previous
    if (value === inputData) {
      
      // this.setState({
      //   pageCounter: 0,
      //   totalH: 0,
      //   quantityCard: 12,
      //   cards: [],
      //   key: true,
      //   open: false,
      //   temporary: undefined,
      //   fillingLevel: function () {
      //     return Math.floor(this.totalH / this.quantityCard);
      //   },
      //   activeButton: false,
      //   load: false,
      //   cardID: '',
      // });

      setKey(loadPagesControl(inputData));
      setLoad(true);
    }
  });
  
  const autoScroll = data => {
    // get first card on page and set her to top
    document.getElementById(data).scrollIntoView({
      block: 'end',
      behavior: 'smooth',
    });
  };

  const changeState = (name, data) => {

    
    this.setState({ [name]: data })
    
  };

  const openModal = data => {
    this.setState(value => ({ open: !value.open, cardID: data }));
  };

  const getCards = parametr => {
    parametr.forEach(element => {
      const { id, webformatURL, largeImageURL } = element;

      this.setState(value => ({
        cards: [...value.cards, { id, webformatURL, largeImageURL }],
      }));
    });
  };

  const getDataFromApi = async (data, counter, quantityCard) => {
    let url = `https://pixabay.com/api/?key=${App.API_KEY}&q=${data}&image_type=photo$orientation=horizontal&safesearch=true&page=1&per_page=${quantityCard}&page=${counter}`;
    return await axios.get(url).then(responce => {
      return responce;
    });
  };

  // "data.totalHits" control
  const loadPagesControl = data => {
    // this.changeState('quantityCard', 200);
    
    //if the request data is repeate
    if (this.state.checkData === data) {
      // "key" - open/close access to calc loaded pages. When total quantity loaded images >= "data.totalHits",
      // "fillingLevel" will not accumulate further and cause an error.
      if (this.state.key) {
        // counter loaded pages
        this.setState(value => ({ pageCounter: value.pageCounter + 1 }));
      }
    }

    // if the request data isn't repeate
    else {
      
      this.setState(value => ({ key: value.key || true }));
      // this.changeState('key', true);
      this.changeState('temporary', undefined);
      this.changeState('pageCounter', 1);
      this.changeState('checkData', data);
      // changeState(scrollValue, 0);
    }

    return this.state.key;
  };

  const request = async data => {
    //'viewKey' - dont't output content, if when total quantity loaded images >= "data.totalHits"
    // and output content, if < "data.totalHits"
    if (key && quantityCard !== 0) {
      await getDataFromApi(
        data,
        pageCounter,
        quantityCard
      )
        .then(responce => {
          if (responce.data.hits.length !== 0) {
            if (pageCounter === 1) {
              this.setState({ totalH: responce.data.totalHits });
              getCards(responce.data.hits);

              Notiflix.Notify.info(
                `Hooray! We found ${responce.data.totalHits} images.`
              );
            } else {
              getCards(responce.data.hits);
            }
            return;
          }

          Notiflix.Notify.warning(
            'Sorry, there are no images matching your search query. Please try again.'
          );
        })
        .catch(error => {
          Notiflix.Notify.warning(error.message);
        });
    }
  };

  return (
    <>
      <Searchbar onSubmit={changeState} />
      <ImageGallery cardData={cards} openModal={openModal} />
      {activeButton && (
        <Button
          addImages={loadPagesControl}
          addInput={inputData}
         />
      )}
      {load && <Loader />}
      {open && (
        <Modal
          currentState={cards}
          imageOpenID={cardID}
          onClose={openModal}
        />
      )}
    </>
  );
}

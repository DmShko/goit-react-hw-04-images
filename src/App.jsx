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
  const [pageCounter, setPageCounter] = useState(0);
  const [totalH, setTotalH] = useState(0);
  const [quantityCard, setQuantityCard] = useState(12);
  const [checkData, setCheckData] = useState('');
  const [inputData, setInputData] = useState('');
  const [cards, setCards] = useState([]);
  const [key, setKey] = useState(true);
  const [open, setOpen] = useState(false);
  const [temporary, setTemporary] = useState(undefined);
  const [fillingLevel, setFillingLevel] = useState( Math.floor(totalH / quantityCard));
  const [activeButton, setActiveButton] = useState(false);
  const [load, setLoad] = useState(false);
  const [cardID, setCardID] = useState('');

  const resetValue = useRef();
  resetValue.current = [0, 0, 12, [], true, false, undefined, 
   Math.floor(totalH / quantityCard), false, false, ''];

  const hooks = {
    pageCounter: {function: setPageCounter, name: pageCounter},
    totalH: {function: setTotalH, name: totalH },
    quantityCard: {function: setQuantityCard, name: quantityCard},
    checkData: {function: setCheckData, name: checkData},
    inputData: {function: setInputData, name: inputData},
    cards: { function: setCards, name: cards},
    key: {function: setKey, name: key },
    open: {function: setOpen, name: open},
    temporary: {function: setTemporary, name: temporary},
    fillingLevel: {function: setFillingLevel, name: fillingLevel},
    activeButton: {function: setActiveButton, name: setActiveButton},
    load: {function: setLoad, name: load},
    cardID: {function: setCardID, name: cardID},
  };

  const reset = () => {
    // reset all states, except "inputData" and "checkData"
    const hooksFilter = Object.keys(hooks).filter(value => value !== "inputData" && value !== "checkData");
    
    hooksFilter.map((element, index) => {
   
      return hooks[element].function(resetValue.current[index]);

    });
  }

  // component did mount
  useEffect(() => {
    if (totalH <= quantityCard) {
      changeState('quantityCard', 12);
      changeState('activeButton', false);
    }
  });
 
  useEffect(() => {
    changeState('fillingLevel', Math.floor(totalH / quantityCard));
  }, [totalH]);

  // scroll down, if 'activeButton' change
  useEffect(() => {
    // scroll only, if 'activeButton' change to 'true',
      // because, if 'activeButton' - false, she doesn't exist in DOM!!! It will be error!!
    if (activeButton === true) autoScroll('loadButton');
  }, [activeButton]);

  // visible button and hidden loader, when cards load
  useEffect(() => {
    
    // if elementsSet.totalH <= elementsSet.quantityCard
    if (totalH >= quantityCard) {
      changeState('load', false);
      changeState('activeButton', true);
    }
    if (totalH <= quantityCard) {
      setLoad(false);
      // if elementsSet.totalH <= elementsSet.quantityCard
      if (totalH <= quantityCard && totalH !== 0) {
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
    } 
  }, [cards])
  
  useEffect(() => {
    if(pageCounter !== 0) {
      // 'activeButton: false', that scroll worked in next event load cards,
      // because scroll react on change 'activeButton'

      changeState('load', true);
      changeState('activeButton', false);
   
      // add last itteration, last part of totalH
      if (
        pageCounter === fillingLevel &&
        totalH > quantityCard
      ) {
       
         // temporery value for last row
        changeState('temporary', fillingLevel + 1);
        changeState('quantityCard', totalH - quantityCard * fillingLevel);
       
      }
       
      // control, when total quantity loaded images >= "data.totalHits"
      if (pageCounter > temporary) {
       
        changeState('quantityCard', 12);

        changeState('load', false);
        changeState('activeButton', false);

        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
        return;
      }

      request(inputData);

    }
  }, [pageCounter]);

  useEffect(() => {
    if (inputData !== '') {

      reset();
      changeState('key', loadPagesControl(inputData));
      changeState('load', true);

    }
  }, [inputData]);

  const autoScroll = data => {
    // get first card on page and set her to top
    document.getElementById(data).scrollIntoView({
      block: 'end',
      behavior: 'smooth',
    });
  };

  const changeState = (functionName, data) => {
    hooks[functionName].function(data);
  };

  const openModal = data => {

    setOpen(value => !value);
    changeState('cardID', data);
    
  };

  const getCards = parametr => {
    parametr.forEach(element => {

      const { id, webformatURL, largeImageURL } = element;
      setCards(value => [...value, {id, webformatURL, largeImageURL}]);
      
    });
  };

  const getDataFromApi = async (data, counter, quantityCard) => {
    let url = `https://pixabay.com/api/?key=${API_KEY}&q=${data}&image_type=photo$orientation=horizontal&safesearch=true&page=1&per_page=${quantityCard}&page=${counter}`;
    return await axios.get(url).then(responce => {
      return responce;
    });
  };

  // "data.totalHits" control
  const loadPagesControl = data => {
    // this.changeState('quantityCard', 200);
  
    //if the request data is repeate
    if (checkData === data) { 
      // "key" - open/close access to calc loaded pages. When total quantity loaded images >= "data.totalHits",
      // "fillingLevel" will not accumulate further and cause an error.
      if (key) {
        
        hooks.pageCounter.function(value => value + 1);

      }
    }
    // if the request data isn't repeate
    else {
      
      setKey(value => !value);

      changeState('temporary', undefined)
      changeState('pageCounter', 1)
      changeState('checkData', data)
    
    }

    return key;
  };

  const request = async data => {
    //'viewKey' - dont't output content, if when total quantity loaded images >= "data.totalHits"
    // and output content, if < "data.totalHits"
    if (key && quantityCard !== 0) {
 
      await getDataFromApi(data, pageCounter, quantityCard)
        .then(responce => {
          if (responce.data.hits.length !== 0) {
            if (pageCounter === 1) {
             
              changeState('totalH', responce.data.totalHits);
              
              // this.setState({ totalH: responce.data.totalHits });
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
        <Button addImages={loadPagesControl} addInput={inputData} />
      )}
      {load && <Loader />}
      {open && (
        <Modal currentState={cards} imageOpenID={cardID} onClose={openModal} />
      )}
    </>
  );
};

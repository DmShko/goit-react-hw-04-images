import axios from 'axios';

const API_KEY = '39566581-ca703ce31ea011c9b51d6d8b4';

const getDataFromApi = async (data, counter, quantityCard) => {
    let url = `https://pixabay.com/api/?key=${API_KEY}&q=${data}&image_type=photo$orientation=horizontal&safesearch=true&page=1&per_page=${quantityCard}&page=${counter}`;
    return await axios.get(url).then(responce => {
      return responce;
    });
};

export default getDataFromApi;
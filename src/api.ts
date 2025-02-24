import axios from 'axios';

const options = {
  method: 'GET',
  url: 'https://cat-breeds.p.rapidapi.com/cat_breeds',
  headers: {
    'x-rapidapi-key': 'e1f18fddc0msh915eaffcd54b79ap1d0698jsnba1128074e33',
    'x-rapidapi-host': 'cat-breeds.p.rapidapi.com'
  }
};

export const fetchData = async () =>  {
  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};


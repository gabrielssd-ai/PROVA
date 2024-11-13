
import axios from 'axios';

const apiJogos = axios.create({
  baseURL: 'https://api.rawg.io/api',
});

export default apiJogos;

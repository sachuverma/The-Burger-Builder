import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://burger-builder-2f918.firebaseio.com/'
});

export default instance;
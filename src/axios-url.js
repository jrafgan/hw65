import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://lesson63-68168.firebaseio.com/'
});

export default instance;
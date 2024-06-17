import axios from 'axios';

export const client = axios.create({
  baseURL: 'http://localhost:5000',
});

const request = (options) => {
  const onSuccess = function (response) {
    return response.data;
  };

  const onError = (error) => {
    return Promise.reject(error.response || error.message);
  };

  return client(options).then(onSuccess).catch(onError);
};

export default request;
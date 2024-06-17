import request from './request.js';

const fetch = () => {
  return request({
    url: '/chat/chats',
    method: 'GET',
  });
};

export default fetch;
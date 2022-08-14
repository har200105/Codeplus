import axios from 'axios';

export const API = axios.create({
  baseURL: 'https://codeplusss.herokuapp.com/api',
});

API.interceptors.request.use(req => {
  if (localStorage.getItem('token')) {
    req.headers.Authorization = `${localStorage.getItem('token')}`;
  }
  return req;
});

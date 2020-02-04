// ACTION 
export const AUTH_SIGNUP_USER = 'AUTH_SIGNUP_USER'; 
export const AUTH_LOGIN_USER = 'AUTH_LOGIN_USER';
export const AUTH_PROCESSING  = 'AUTH_PROCESSING';
export const SET_CATEGORIES  = 'SET_CATEGORIES';

// create new user
export const API_ROOT_URL = process.env.REACT_APP_ROOT_ENDPOINT_URL ? process.env.REACT_APP_ROOT_ENDPOINT_URL : "http://127.0.0.1:3000";
export const API_CREATE_USER = API_ROOT_URL + "/api/users/create";
export const API_GET_USER = API_ROOT_URL + "/api/users/";
export const API_GET_CATEGORIES = API_ROOT_URL + "/api/categories/";
export const API_CREATE_POST = API_ROOT_URL + "/api/posts/create";
export const API_CREATE_VIDEOPOST =  API_ROOT_URL + "/api/posts/create-video";

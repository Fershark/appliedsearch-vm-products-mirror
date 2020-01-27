// ACTION 
export const AUTH_SIGNUP_USER = 'AUTH_SIGNUP_USER'; 
export const AUTH_LOGIN_USER = 'AUTH_LOGIN_USER';
export const AUTH_PROCESSING  = 'AUTH_PROCESSING';
export const SET_CATEGORIES  = 'SET_CATEGORIES';


// create new user
export const API_ROOT_URL = process.env.REACT_APP_ROOT_ENDPOINT_URL ? process.env.REACT_APP_ROOT_ENDPOINT_URL : "http://127.0.0.1:5000";
export const API_CREATE_USER = process.env.REACT_APP_ENDPOINT_CREATE_USER ? process.env.REACT_APP_ENDPOINT_CREATE_USER : API_ROOT_URL + "/api/users/create";
export const API_GET_USER = process.env.REACT_APP_ENDPOINT_GET_USER ? process.env.REACT_APP_ENDPOINT_GET_USER : API_ROOT_URL + "/api/users/";
export const API_GET_CATEGORIES = process.env.REACT_APP_ENDPOINT_GET_CATEGORIES ? process.env.REACT_APP_ENDPOINT_GET_CATEGORIES : API_ROOT_URL + "/api/categories/";
export const API_CREATE_POST = process.env.REACT_APP_ENDPOINT_CREATE_POST ? process.env.REACT_APP_ENDPOINT_CREATE_POST : API_ROOT_URL + "/api/posts/create";
export const API_CREATE_VIDEOPOST = process.env.REACT_APP_ENDPOINT_CREATE_VIDEOPOST ? process.env.REACT_APP_ENDPOINT_CREATE_VIDEOPOST : API_ROOT_URL + "/api/posts/create-video";
export const API_GET_TAGS = process.env.REACT_APP_ENDPOINT_GET_TAGS ? process.env.REACT_APP_ENDPOINT_GET_TAGS : API_ROOT_URL + "/api/tags/";
export const API_GET_POSTS = process.env.REACT_APP_ENDPOINT_GET_POSTS ? process.env.REACT_APP_ENDPOINT_GET_POSTS : API_ROOT_URL + "/api/posts/";
export const API_UPLOAD_POST_VIDEO = process.env.REACT_APP_ENDPOINT_UPLOAD_POST_VIDEO ? process.env.REACT_APP_ENDPOINT_UPLOAD_POST_VIDEO : API_ROOT_URL + "/api/posts/video-upload";

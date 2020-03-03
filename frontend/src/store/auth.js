import {AUTH_LOGIN_USER, AUTH_LOGOUT} from '../config/endpoints-conf';

const initialState = {
  user: JSON.parse(localStorage.getItem('app_user')),
};
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_LOGIN_USER:
      localStorage.setItem('app_user', JSON.stringify(action.payload.user));
      return {
        ...state,
        user: action.payload.user,
      };
    case AUTH_LOGOUT:
      localStorage.setItem('app_user', null);
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
};

export default authReducer;

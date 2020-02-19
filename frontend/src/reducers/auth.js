import { 
    AUTH_SIGNUP_USER, AUTH_LOGIN_USER, AUTH_PROCESSING 
} from '../config/endpoints-conf';

const initialState = {
  auth_processing: false,
  auth_message: {
    message: '',
    success: false,
  },
  user: JSON.parse(localStorage.getItem('app_user')),
};
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_PROCESSING:
      return {
        ...state,
        auth_processing: action.payload,
        auth_message: {
          message: '',
          success: false,
        },
      };
    case AUTH_SIGNUP_USER:
    case AUTH_LOGIN_USER:
      localStorage.setItem('app_user', JSON.stringify(action.payload.user));
      return {
        ...state,
        auth_message: {
          message: action.payload.message,
          success: action.payload.success,
        },
        user: action.payload.user,
      };
    default:
      return state;
  }
};

export default authReducer;

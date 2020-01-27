import { 
    AUTH_SIGNUP_USER, AUTH_LOGIN_USER, AUTH_PROCESSING 
} from '../config/endpoints-conf';

const initialState = {
    is_authenticated: false,
    auth_processing: false,
    auth_message: {},
};
const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case AUTH_PROCESSING:
            return {...state, auth_processing: action.payload}
        case AUTH_SIGNUP_USER:
        case AUTH_LOGIN_USER:
            return {...state, 
                auth_message: { 
                    message: action.payload.message, 
                    success: action.payload.success
                }
            };
        default:
            return state;
    }
}

export default authReducer;

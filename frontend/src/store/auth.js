import {createAction} from '@reduxjs/toolkit';

// Actions
export const saveUser = createAction('AUTH_SAVE_USER');

const initialState = {
  user: JSON.parse(localStorage.getItem('app_user')),
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case saveUser.type:
      localStorage.setItem('app_user', JSON.stringify(action.payload));
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

export default authReducer;

import {createAction} from '@reduxjs/toolkit';

// Actions
export const saveUser = createAction('AUTH_SAVE_USER');

const initialState = {
  user: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case saveUser.type:
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

export default authReducer;

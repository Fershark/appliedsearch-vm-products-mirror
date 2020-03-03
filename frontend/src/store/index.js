import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import AuthReducer from './auth';

const rootReducer = {
  auth: AuthReducer,
};

const middleware = [...getDefaultMiddleware(), logger, thunk];

const store = configureStore({
  reducer: rootReducer, 
  middleware,
});

export default store;

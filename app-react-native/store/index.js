import {combineReducers} from 'redux';
import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import {persistStore, persistReducer} from 'redux-persist';
import {AsyncStorage} from 'react-native';

import AuthReducer from './auth';

const rootReducer = combineReducers({
  auth: AuthReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const middleware = [logger, thunk];

export default () => {
  let store = configureStore({
    reducer: persistedReducer,
    middleware,
  });
  let persistor = persistStore(store);
  return {store, persistor};
};

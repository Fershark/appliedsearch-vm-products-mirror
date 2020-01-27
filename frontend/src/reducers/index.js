import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import AuthReducer from './auth';

const rootReducer = combineReducers({
    auth: AuthReducer
});

const store = createStore(
    rootReducer,
    compose(
        applyMiddleware(thunk)
    )
)

export default store;

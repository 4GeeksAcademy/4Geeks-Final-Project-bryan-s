import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import artworkReducer from './artworkReducer';

const store = createStore(artworkReducer, applyMiddleware(thunk));

export default store;

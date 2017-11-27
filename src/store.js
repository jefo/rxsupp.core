import { createStore, applyMiddleware, combineReducers } from 'redux';
import Immutable from 'immutable';
import createLogger from 'redux-cli-logger';
import socketProxy from './reduxSocketMiddleware';
import chat from './chat';

const logger = createLogger({
    stateTransformer: (state) => {
        let newState = {};
        for (var i of Object.keys(state)) {
            if (Immutable.Iterable.isIterable(state[i])) {
                newState[i] = state[i].toJS();
            } else {
                newState[i] = state[i];
            }
        }
        return newState;
    }
});

const store = createStore(
    chat,
    applyMiddleware(logger, socketProxy)
);

export default store;

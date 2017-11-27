import { OrderedMap, fromJS } from 'immutable';
import { combineReducers, bindActionCreators } from 'redux';
import { createSelector } from 'reselect';

export const CHAT_UPDATE = 'CHAT_UPDATE';
export const CHAT_READY = 'CHAT_READY';
export const CHAT_INIT = 'CHAT_INIT';
export const USER_ADD = 'USER_ADD';
export const USER_UPDATE = 'USER_UPDATE';
export const USER_DISCONNECT = 'USER_DISCONNECT';
export const USER_SET_ROOM = 'USER_SET_ROOM';
export const USER_SIGN_UP = 'USER_SIGN_UP';
export const USER_SIGN_IN = 'USER_SIGN_IN';
export const SET_USER_OFFLINE = 'SET_USER_OFFLINE';
export const MESSAGE_ADD = 'MESSAGE_ADD';
export const MESSAGE_SEND = 'MESSAGE_SEND';
export const CONNECT_WITH_USER = 'CONNECT_WITH_USER';
export const OPERATOR_CONNECTED = 'OPERATOR_CONNECTED';
export const REQUEST_MASSAGES_HISTORY = 'REQUEST_MASSAGES_HISTORY';

export class Message {
    constructor(text) {
        this.timestamp = new Date().getTime();
        this.userId = null;
        this.text = text;
    }
}

export class User {
    constructor(attrs) {
        this.login = attrs.login ? attrs.login : attrs.socketId;
        this.socketId = attrs.socketId;
        this.isLoggedIn = this.login !== attrs.socketId;
        this.status = 'online';
        this.roomId = attrs.roomId
    }
}

export const Actions = {
    addMessage: (message) => ({ type: MESSAGE_ADD, payload: message }),
    addUser: (user) => ({ type: USER_ADD, payload: new User(user) }),
    updateUser: (user) => ({ payload: user, type: USER_UPDATE }),
    signIn: (socketId, login) => ({ type: USER_SIGN_IN, payload: { socketId, login } }),
    signUp: (login) => ({ type: USER_SIGN_UP, payload: { login } }),
    init: (socketId, users, messages) => {
        return { type: CHAT_INIT, payload: { socketId, users, messages } };
    }
};

/**
 * Create redux service with selectors and actions
 * @param {*} store 
 */
export const createChat = (store) => {
    let actions = bindActionCreators(Actions, store.dispatch);
    const createStateSelector = (...args) => () => createSelector(...args)(store.getState());
    let selectors = {
        selectAll: createStateSelector(
            state => state.users,
            state => state.messages,
            (users, messages) => {
                return {
                    users: users.filter(user => user.get('status') !== 'offline').toJS(),
                    messages: messages.toJS()
                };
            }
        ),
        userSelector: socketId => createStateSelector(
            state => state.users,
            (users) => users.find(user => user.get('socketId') === socketId)
        )
    };
    return Object.assign({}, actions, selectors);
};

const messagesInitialState = OrderedMap();

export const messagesReducer = (state = messagesInitialState, { type, payload }) => {
    switch (type) {
        case CHAT_INIT:
            return state.merge(fromJS(payload.messages));
        case MESSAGE_ADD:
        case MESSAGE_SEND:
            return state.set(payload.timestamp, payload);
        default:
            return state;
    }
}

const usersInitialState = OrderedMap();

export const usersReducer = (state = usersInitialState, { type, payload }) => {
    switch (type) {
        case CHAT_INIT:
            return state.merge(fromJS(payload.users));
        case USER_SIGN_IN:
            return state
                .set(payload.login, fromJS(payload))
                .remove(payload.socketId);
        case USER_ADD:
            let addKey = payload.login ? payload.login : payload.socketId;
            return state.set(addKey, OrderedMap(payload));
        case USER_UPDATE:
            let key = payload.login ? payload.login : payload.socketId;
            return state.update(key, user => {
                if (!user.merge) {
                    user = fromJS(user)
                }
                return user.merge(fromJS(payload))
            });
        default:
            return state;
    }
}

/**
 * Create chat reducer
 * @param {Object} reducers Additional reducers
 */
export default (reducers) => combineReducers(Object.assign({}, {
    users: usersReducer,
    messages: messagesReducer
}, reducers));

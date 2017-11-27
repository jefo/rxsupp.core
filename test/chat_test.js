import assert from 'assert';
import { OrderedMap } from 'immutable';
import { createStore } from 'redux';

import {
  messagesReducer,
  usersReducer,
  Actions,
  Message,
  User,
  createChat
} from '../src/chat';
import chat from '../src/chat';

describe('chat', () => {

  const store = createStore(
    chat
  )

  it('createChat', () => {
    let chat = createChat(store);
    Object.keys(Actions).forEach(key => {
      assert.ok(chat[key]);
    });
    assert.ok(chat.userSelector);
    assert.ok(chat.selectAll);
  });

  it('MESSAGE_SEND', () => {
    let messageAction = Actions.addMessage('привет');
    assert.deepEqual(messageAction, {
      type: 'MESSAGE_ADD',
      payload: messageAction.payload
    });
    let state = messagesReducer(OrderedMap(), messageAction);
    let expectedState = {
      [messageAction.payload.timestamp]: messageAction.payload
    };
    assert.deepEqual(state.toJS(), expectedState);
  });

  it('USER_ADD', () => {
    const action = Actions.addUser({ socketId: '1', roomId: 'room' });
    assert.deepEqual(action, {
      type: 'USER_ADD',
      payload: {
        login: '1',
        isLoggedIn: false,
        socketId: '1',
        status: 'online',
        roomId: 'room'
      },
    });
    let state = usersReducer(OrderedMap(), action);
    let expectedState = {
      [action.payload.login]: action.payload
    };
    assert.deepEqual(state.toJS(), expectedState);
  });

  it('CHAT_INIT', () => {
    let users = {
      '1': new User({
        socketId: '1',
        roomId: 'room1'
      }),
      '2': new User({
        socketId: '2',
        roomId: 'room1'
      })
    };
    let messages = {
      1: new Message('привет?'),
      1: new Message('привет!'),
    };
    let action = Actions.init('1', users, messages);
    assert.deepEqual(action, {
      type: 'CHAT_INIT',
      payload: { socketId: 1, users, messages }
    });
    let usersState = usersReducer(OrderedMap(), action);
    assert.deepEqual(usersState.toJS(), users);
    let messagesState = messagesReducer(OrderedMap(), action);
    assert.deepEqual(messagesState.toJS(), messages);
  });

  // it('signIn', () => {
  //   const action = Actions.signIn(123, 'login');
  //   assert.deepEqual(action, {
  //     type: 'USER_SIGN_IN',
  //     payload: { socketId: 123, login: 'login' },
  //     meta: { room: 'room1', event: 'USER_ADD' }
  //   });
  // });

  // it('USER_SIGN_IN', () => {
  //   const action = Actions.signIn('123', 'login');
  //   let initialState = OrderedMap({
  //     [action.payload.socketId]: action.payload
  //   });
  //   let state = usersReducer(initialState, action);
  //   let expectedState = {
  //     [action.payload.login]: action.payload
  //   };
  //   assert.deepEqual(state.toJS(), expectedState);
  // });
});

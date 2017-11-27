import assert from 'assert';
import { OrderedMap } from 'immutable';
import {
  messagesReducer,
  usersReducer,
  Actions,
  Message,
  User
} from '../src/chat';

describe('chat', () => {

  it('sendMessage', () => {
    let messageAction = Actions.sendMessage('привет');
    assert.deepEqual(messageAction, {
      type: 'MESSAGE_SEND',
      payload: messageAction.payload,
      meta: { room: 'room1', event: 'MESSAGE_ADD' }
    });
  });

  it('MESSAGE_SEND', () => {
    let messageAction = Actions.sendMessage('привет');
    let state = messagesReducer(OrderedMap(), messageAction);
    let expectedState = {
      [messageAction.payload.timestamp]: messageAction.payload
    };
    assert.deepEqual(state.toJS(), expectedState);
  });

  it('USER_ADD', () => {
    const action = Actions.addUser('login');
    assert.deepEqual(action, {
      type: 'USER_ADD',
      payload: { login: 'login', isLoggedIn: false, socketId: 'login' },
      meta: { room: 'room1', event: 'USER_UPDATE' }
    });
    let state = usersReducer(OrderedMap(), action);
    let expectedState = {
      [action.payload.login]: action.payload
    };
    assert.deepEqual(state.toJS(), expectedState);
  });

  it('signIn', () => {
    const action = Actions.signIn(123, 'login');
    assert.deepEqual(action, {
      type: 'USER_SIGN_IN',
      payload: { socketId: 123, login: 'login' },
      meta: { room: 'room1', event: 'USER_ADD' }
    });
  });

  it('USER_SIGN_IN', () => {
    const action = Actions.signIn('123', 'login');
    let initialState = OrderedMap({
      [action.payload.socketId]: action.payload
    });
    let state = usersReducer(initialState, action);
    let expectedState = {
      [action.payload.login]: action.payload
    };
    assert.deepEqual(state.toJS(), expectedState);
  });
});

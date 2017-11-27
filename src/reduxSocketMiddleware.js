import io from './index';
import { USER_ADD, USER_DISCONNECT } from './chat';

export default store => next => action => {
    if (action.meta && action.payload) {
        let { event } = action.meta;
        let room = action.payload.roomId ? action.payload.roomId : action.payload.socketId
        let target = room ? io.to(room) : io;
        target.emit(event, action.payload);
        console.log('emit', action);
    }
    let { type, payload } = action;
    switch (type) {
        case USER_ADD:
            io.emit(USER_ADD, payload);
            break;
            break;
        default:
            return next(action);
    }
    return next(action);
};

export default class User {
    constructor(attrs) {
        this.login = attrs.login ? attrs.login : attrs.socketId;
        this.socketId = attrs.socketId;
        this.isLoggedIn = this.login !== attrs.socketId;
        this.status = 'online';
        this.roomId = attrs.roomId
    }
}

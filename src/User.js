export default class User {
    constructor(attrs) {
        this.id = attrs.id;
        this.login = attrs.login ? attrs.login : attrs.socketId;
        this.socketId = attrs.socketId;
        this.isLoggedIn = this.login !== attrs.socketId;
        this.status = 'online';
        this.room = attrs.room;
        this.color = attrs.color;
    }
}

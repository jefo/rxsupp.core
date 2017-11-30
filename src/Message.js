export default class Message {
    constructor(attrs) {
        this.timestamp = new Date().getTime();
        this.userId = attrs.userId;
        this.text = attrs.text;
        this.room = attrs.room;
    }
}

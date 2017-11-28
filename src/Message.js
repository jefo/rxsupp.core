export default class Message {
    constructor(text) {
        this.timestamp = new Date().getTime();
        this.userId = null;
        this.text = text;
    }
}

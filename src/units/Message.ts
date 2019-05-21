class Message {

    public messageID : number;
    public senderID : number;
    public receiverID : string;
    public sendtime : number;
    public type : number;
    public subject : string;
    public body : string;
    public deleted : boolean;

    public isValid() : boolean {
        return false;
    }

}

export { Message };

class Message {

    messageID : number;
    senderID : number;
    receiverID : string;
    sendtime : number;
    type : number;
    subject : string;
    body : string;
    deleted : boolean;

    isValid() : boolean {
        return false;
    }

}

export { Message }
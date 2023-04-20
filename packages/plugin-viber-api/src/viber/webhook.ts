import { Request, Response } from 'express';
import { ViberMessage } from '../models';

export const receiveWebhook = (req: Request, res: Response) => {
  //   console.log("################");
  //   console.log(req.body);
  //   console.log("################");

  if (req.body.event === 'message') {
    saveMessage(req.body);
  }

  res.send('ok');
};

export const saveMessage = (message: any) => {
  const data = {
    senderId: message.sender.id,
    senderName: message.sender.name,
    sendDate: new Date(message.timestamp),
    messageText: message.message.text,
    messageType: message.message.type
  };

  console.log('################');
  console.log(data);
  console.log('################');

  const viberMessage = new ViberMessage(data);

  viberMessage.save();
};

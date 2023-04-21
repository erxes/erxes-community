import { Request, Response } from 'express';
import { ViberReceivedMessage } from '../models';

export const receiveWebhook = (req: Request, res: Response) => {
  if (req.body.event === 'message') {
    saveMessage(req.body);
  }

  res.json({ status: 'success' });
};

export const saveMessage = (message: any) => {
  const data = {
    userId: message.userId,
    senderId: message.sender.id,
    senderName: message.sender.name,
    sendDate: new Date(message.timestamp),
    messageText: message.message.text,
    messageType: message.message.type
  };

  const viberReceivedMessage = new ViberReceivedMessage(data);

  viberReceivedMessage.save();
};

import { Request, Response } from 'express';
import { ViberReceivedMessage } from '../models';

export const receiveWebhook = (req: Request, res: Response) => {
  if (req.body.event === 'message') {
    saveMessage(req.body, req.params.integrationId);
  }

  res.json({ status: 'success' });
};

const saveMessage = (message: any, inboxId: string) => {
  const data = {
    inboxId: inboxId,
    senderId: message.sender.id,
    senderName: message.sender.name,
    sendDate: new Date(message.timestamp),
    messageText: message.message.text,
    messageType: message.message.type
  };

  const viberReceivedMessage = new ViberReceivedMessage(data);

  viberReceivedMessage.save();
};

import { Request, Response } from 'express';
import messageListen from './messageListen';
import { getSubdomain } from '@erxes/api-utils/src/core';

const webhookListen = async (req: Request, res: Response) => {
  const subdomain = getSubdomain(req);

  if (req.body.event === 'message') {
    await messageListen(req.body, req.params.integrationId, subdomain);
  }

  res.json({ status: 'success' });
};

export default webhookListen;

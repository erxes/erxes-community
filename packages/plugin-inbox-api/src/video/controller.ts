import { debugDaily, debugRequest } from './debuggers';
import { routeErrorHandling } from './helpers';
import { CallRecords, ICallRecord, IRecording } from '../models/definitions/callRecords';
import { Express, Request, Response } from 'express';
import Configs from '../models/definitions/configs';
import { sendRequest } from '@erxes/api-utils/src/requests';

const VIDEO_CALL_STATUS = {
  ONGOING: 'ongoing',
  END: 'end',
  ALL: ['ongoing', 'end']
};

const DAILY_END_POINT = 'https://api.daily.co';

export const getAuthToken = async () => {
  const config = await Configs.getConfig('DAILY_API_KEY');
  return config.value;
};

const getAuthHeader = async () => {
  return { authorization: `Bearer ${await getAuthToken()}` };
};

export const sendDailyRequest = async (url: string, method: string, body = {}) => {
  return sendRequest({
    headers: await getAuthHeader(),
    url: `${DAILY_END_POINT}${url}`,
    method,
    body
  });
};

export const isAfter = (expiresTimestamp: number, defaultMillisecond?: number): boolean => {
  const millisecond = defaultMillisecond || new Date().getTime();
  const expiresMillisecond = new Date(expiresTimestamp * 1000).getTime();
  return expiresMillisecond > millisecond;
};

export const getRecordings = async (recordings: IRecording[]) => {
  const newRecordings: IRecording[] = [];
  for (const record of recordings) {
    if (!record.expires || (record.expires && !isAfter(record.expires))) {
      const accessLinkResponse = await sendDailyRequest(`/api/v1/recordings/${record.id}/access-link`, 'GET');
      record.expires = accessLinkResponse.expires;
      record.url = accessLinkResponse.download_link;
    }
    newRecordings.push(record);
  }
  return newRecordings;
};

const init = async (app: Express) => {
  app.get(
    '/videoCall/usageStatus',
    routeErrorHandling(async (req: Request, res: Response) => {
      const videoCallType = await Configs.getConfig('VIDEO_CALL_TYPE');

      if (videoCallType.value === 'daily') {
        return res.send(Boolean((await getAuthToken()) && DAILY_END_POINT));
      } else {
        return res.send(false);
      }
    })
  );

  app.delete(
    '/daily/rooms',
    routeErrorHandling(async (req: Request, res: Response) => {
      const response = await sendDailyRequest('/api/v1/rooms', 'GET');
      const rooms = response.data || [];

      for (const room of rooms) {
        await CallRecords.updateOne({ roomName: room.name }, { $set: { status: VIDEO_CALL_STATUS.END } });
        await sendDailyRequest(`/api/v1/rooms/${room.name}`, 'DELETE');
      }

      return res.send('Successfully deleted all rooms');
    })
  );

  app.delete(
    '/daily/rooms/:roomName',
    routeErrorHandling(async (req: Request, res: Response) => {
      const { roomName } = req.params;

      const callRecord = await CallRecords.findOne({
        roomName,
        status: VIDEO_CALL_STATUS.ONGOING
      });

      if (callRecord) {
        const response = await sendDailyRequest(`/api/v1/rooms/${callRecord.roomName}`, 'DELETE');
        await CallRecords.updateOne({ _id: callRecord._id }, { $set: { status: VIDEO_CALL_STATUS.END } });
        return res.json(response.deleted);
      }

      return res.json({});
    })
  );

  app.get(
    '/daily/room',
    routeErrorHandling(async (req: Request, res: Response) => {
      debugRequest(debugDaily, req);

      const { erxesApiMessageId } = req.query;
      const callRecord = await CallRecords.findOne({ erxesApiMessageId });

      const response: {
        url?: string;
        status?: string;
        recordingLinks?: string[];
      } = { url: '', status: VIDEO_CALL_STATUS.END, recordingLinks: [] };

      if (callRecord) {
        response.url = `${DAILY_END_POINT}/${callRecord.roomName}?t=${callRecord.token}`;
        response.status = callRecord.status;
        const updatedRecordins: IRecording[] = await getRecordings(callRecord.recordings || []);
        callRecord.recordings = updatedRecordins;
        await callRecord.save();
        response.recordingLinks = updatedRecordins.map(r => r.url) as string[];
      }

      return res.json(response);
    })
  );

  app.get(
    '/daily/get-active-room',
    routeErrorHandling(async (req: Request, res: Response) => {
      debugRequest(debugDaily, req);

      const { erxesApiConversationId } = req.query;

      const callRecord = await CallRecords.findOne({
        erxesApiConversationId,
        status: VIDEO_CALL_STATUS.ONGOING
      });

      const response: {
        url?: string;
        name?: string;
        recordingLinks?: string[];
      } = {
        recordingLinks: []
      };

      if (callRecord) {
        const ownerTokenResponse = await sendDailyRequest('/api/v1/meeting-tokens/', 'POST', {
          properties: { room_name: callRecord.roomName }
        });

        response.url = `${DAILY_END_POINT}/${callRecord.roomName}?t=${ownerTokenResponse.token}`;
        response.name = callRecord.roomName;
      }

      return res.json(response);
    })
  );

  app.post(
    '/daily/saveRecordingInfo',
    routeErrorHandling(async (req: Request, res: Response) => {
      debugRequest(debugDaily, req);
      const { erxesApiConversationId, recordingId } = req.body;
      await CallRecords.updateOne(
        { erxesApiConversationId, status: VIDEO_CALL_STATUS.ONGOING },
        { $push: { recordings: { id: recordingId } } }
      );

      return res.json({
        status: 'ok'
      });
    })
  );

  app.post(
    '/daily/room',
    routeErrorHandling(async (req: Request, res: Response) => {
      debugRequest(debugDaily, req);
      const { erxesApiMessageId, erxesApiConversationId } = req.body;
      const privacy = 'private';
      const response = await sendDailyRequest(`/api/v1/rooms`, 'POST', {
        privacy
      });

      const tokenResponse = await sendDailyRequest(`/api/v1/meeting-tokens/`, 'POST', {
        properties: { room_name: response.name }
      });

      const doc: ICallRecord = {
        erxesApiConversationId,
        erxesApiMessageId,
        roomName: response.name,
        kind: 'daily',
        privacy,
        token: tokenResponse.token
      };

      const callRecord = await CallRecords.createCallRecord(doc);

      // const ownerTokenResponse = await sendDailyRequest(`/api/v1/meeting-tokens/`, 'POST', {
      //   properties: { room_name: response.name, enable_recording: 'cloud' },
      // });

      console.log('DONE!!!-');

      return res.json({
        // url: `${DAILY_END_POINT}/${callRecord.roomName}?t=${ownerTokenResponse.token}`,
        name: callRecord.roomName,
        status: VIDEO_CALL_STATUS.ONGOING
      });
    })
  );
};

export default init;

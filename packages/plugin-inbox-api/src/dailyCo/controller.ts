import { CallRecords, IRecording } from '../models/definitions/callRecords';
import { Express } from 'express';
import Configs from '../models/definitions/configs';
import { sendRequest } from '@erxes/api-utils/src/requests';

const VIDEO_CALL_STATUS = {
  ONGOING: 'ongoing',
  END: 'end',
  ALL: ['ongoing', 'end']
};

const DAILY_END_POINT: string = 'https://api.daily.co';

export const getAuthToken = async (): Promise<string> => {
  const config = await Configs.getConfig('DAILY_API_KEY');
  return config.value;
};

const getAuthHeader = async () => {
  return { authorization: `Bearer ${await getAuthToken()}` };
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
      const accessLinkResponse = await sendDailyRequest(`/v1/recordings/${record.id}/access-link`, 'GET');
      record.expires = accessLinkResponse.expires;
      record.url = accessLinkResponse.download_link;
    }
    newRecordings.push(record);
  }
  return newRecordings;
};

export const sendDailyRequest = async (url: string, method: string, body = {}) => {
  return sendRequest({
    headers: await getAuthHeader(),
    url: `${DAILY_END_POINT}${url}`,
    method,
    body
  });
};

export const getRoomDetail = async (roomName: string) => {
  try {
    return await sendDailyRequest(`/v1/rooms/${roomName}`, 'GET');
  } catch (e) {
    return null;
  }
};

export const getRoomList = async () => {
  try {
    const response = await sendDailyRequest('/v1/rooms', 'GET');
    return response.data;
  } catch (e) {
    throw new Error(e.message);
  }
};

export const createRoom = async () => {
  try {
    return await sendDailyRequest('/v1/rooms', 'POST', {
      privacy: 'private'
    });
  } catch (e) {
    throw new Error(e.message);
  }
};

export const deleteRoom = async (roomName: string) => {
  const callRecord = await CallRecords.findOne({
    roomName,
    status: VIDEO_CALL_STATUS.ONGOING
  });

  if (callRecord) {
    sendDailyRequest(`/v1/rooms/${roomName}`, 'DELETE');
    CallRecords.updateOne({ _id: callRecord._id }, { $set: { status: VIDEO_CALL_STATUS.END } });
  }

  return true;
};

export const deleteAllRoom = async () => {
  try {
    const response = await sendDailyRequest('/api/v1/rooms', 'GET');
    const rooms = response.data || [];

    for (const room of rooms) {
      await CallRecords.updateOne({ roomName: room.name }, { $set: { status: VIDEO_CALL_STATUS.END } });
      await sendDailyRequest(`/api/v1/rooms/${room.name}`, 'DELETE');
    }

    return true;
  } catch (e) {
    throw new Error(e.message);
  }
};

const init = async (app: Express) => {
  //   app.get(
  //     '/daily/room',
  //     routeErrorHandling(async (req: Request, res: Response) => {
  //       debugRequest(debugDaily, req);
  //
  //       const { erxesApiMessageId } = req.query;
  //       const callRecord = await CallRecords.findOne({ erxesApiMessageId });
  //
  //       const response: {
  //         url?: string;
  //         status?: string;
  //         recordingLinks?: string[];
  //       } = { url: '', status: VIDEO_CALL_STATUS.END, recordingLinks: [] };
  //
  //       if (callRecord) {
  //         response.url = `${DAILY_END_POINT}/${callRecord.roomName}?t=${callRecord.token}`;
  //         response.status = callRecord.status;
  //         const updatedRecordins: IRecording[] = await getRecordings(callRecord.recordings || []);
  //         callRecord.recordings = updatedRecordins;
  //         await callRecord.save();
  //         response.recordingLinks = updatedRecordins.map(r => r.url) as string[];
  //       }
  //
  //       return res.json(response);
  //     })
  //   );
  //
  //   app.get(
  //     '/daily/get-active-room',
  //     routeErrorHandling(async (req: Request, res: Response) => {
  //       debugRequest(debugDaily, req);
  //
  //       const { erxesApiConversationId } = req.query;
  //
  //       const callRecord = await CallRecords.findOne({
  //         erxesApiConversationId,
  //         status: VIDEO_CALL_STATUS.ONGOING
  //       });
  //
  //       const response: {
  //         url?: string;
  //         name?: string;
  //         recordingLinks?: string[];
  //       } = {
  //         recordingLinks: []
  //       };
  //
  //       if (callRecord) {
  //         const ownerTokenResponse = await sendDailyRequest('/api/v1/meeting-tokens/', 'POST', {
  //           properties: { room_name: callRecord.roomName }
  //         });
  //
  //         response.url = `${DAILY_END_POINT}/${callRecord.roomName}?t=${ownerTokenResponse.token}`;
  //         response.name = callRecord.roomName;
  //       }
  //
  //       return res.json(response);
  //     })
  //   );
  //
  //   app.post(
  //     '/daily/saveRecordingInfo',
  //     routeErrorHandling(async (req: Request, res: Response) => {
  //       debugRequest(debugDaily, req);
  //       const { erxesApiConversationId, recordingId } = req.body;
  //       await CallRecords.updateOne(
  //         { erxesApiConversationId, status: VIDEO_CALL_STATUS.ONGOING },
  //         { $push: { recordings: { id: recordingId } } }
  //       );
  //
  //       return res.json({
  //         status: 'ok'
  //       });
  //     })
  //   );
  //
  //   app.post(
  //     '/daily/room',
  //     routeErrorHandling(async (req: Request, res: Response) => {
  //       debugRequest(debugDaily, req);
  //       const { erxesApiMessageId, erxesApiConversationId } = req.body;
  //       const privacy = 'private';
  //       const response = await sendDailyRequest(`/api/v1/rooms`, 'POST', {
  //         privacy
  //       });
  //
  //       const tokenResponse = await sendDailyRequest(`/api/v1/meeting-tokens/`, 'POST', {
  //         properties: { room_name: response.name }
  //       });
  //
  //       const doc: ICallRecord = {
  //         erxesApiConversationId,
  //         erxesApiMessageId,
  //         roomName: response.name,
  //         kind: 'daily',
  //         privacy,
  //         token: tokenResponse.token
  //       };
  //
  //       const callRecord = await CallRecords.createCallRecord(doc);
  //
  //       // const ownerTokenResponse = await sendDailyRequest(`/api/v1/meeting-tokens/`, 'POST', {
  //       //   properties: { room_name: response.name, enable_recording: 'cloud' },
  //       // });
  //
  //       console.log('DONE!!!-');
  //
  //       return res.json({
  //         // url: `${DAILY_END_POINT}/${callRecord.roomName}?t=${ownerTokenResponse.token}`,
  //         name: callRecord.roomName,
  //         status: VIDEO_CALL_STATUS.ONGOING
  //       });
  //     })
  //   );
};

export default init;

import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/index.js';

export function setupSessionCookies(res, session) {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + FIFTEEN_MINUTES),
  });
}

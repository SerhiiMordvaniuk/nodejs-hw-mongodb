import createHttpError from 'http-errors';
import { Session } from '../db/models/session.js';
import { User } from '../db/models/user.js';

export async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    next(createHttpError(401, 'Please provide Authorization header'));
    return;
  }

  const authBearer = authHeader.split(' ')[0];
  const authToken = authHeader.split(' ')[1];

  if (authBearer !== 'Bearer' || !authToken) {
    next(createHttpError(401, 'Auth header should be of type Bearer'));
    return;
  }

  const session = await Session.findOne({ accessToken: authToken });

  if (!session) {
    next(createHttpError(401, 'Session not found'));
    return;
  }

  const isAccessTokenExpired =
    new Date() > new Date(session.accessTokenValidUntil);

  if (isAccessTokenExpired) {
    next(createHttpError(401, 'Access token expired'));
  }

  const user = await User.findById(session.userId);

  if (!user) {
    next(createHttpError(401));
    return;
  }
  req.user = user;

  next();
}

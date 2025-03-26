import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';

import { User } from '../db/models/user.js';
import { Session } from '../db/models/session.js';
import { createSession } from '../utils/createSession.js';

export async function registerUser(payload) {
  const user = await User.findOne({ email: payload.email });

  if (user) throw createHttpError(409, 'Email in use');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  const newUser = await User.create({
    ...payload,
    password: encryptedPassword,
  });

  return newUser;
}

export async function loginUser(payload) {
  const user = await User.findOne({ email: payload.email });

  if (!user) throw createHttpError(404, 'User not found or wrong email');

  const isPasswordCorrect = await bcrypt.compare(
    payload.password,
    user.password,
  );

  if (!isPasswordCorrect) throw createHttpError(401, 'Password is wrong');

  await Session.deleteOne({ userId: user._id });

  const newSession = createSession();

  return await Session.create({ ...newSession, userId: user._id });
}

export async function logoutUser(sessionId) {
  await Session.deleteOne({ _id: sessionId });
}

export async function refreshUserSession({ sessionId, refreshToken }) {
  const session = await Session.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) throw createHttpError(401, 'Session not found');

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired)
    throw createHttpError(401, 'Session token expired');

  const newSession = createSession();

  await Session.deleteOne({ _id: sessionId, refreshToken });

  return await Session.create({
    userId: session.userId,
    ...newSession,
  });
}

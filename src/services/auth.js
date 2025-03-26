import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import randomBytes from 'randombytes';

import { User } from '../db/models/user.js';
import { Session } from '../db/models/session.js';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/index.js';

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

  await Session.deleteOne({ iserId: user._id });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  const newSession = await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: Date.now() + FIFTEEN_MINUTES,
    refreshTokenValidUntil: Date.now() + ONE_DAY,
  });

  return newSession;
}

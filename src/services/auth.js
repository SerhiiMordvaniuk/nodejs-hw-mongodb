import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';

import path from 'node:path';
import fs from 'node:fs/promises';

import { User } from '../db/models/user.js';
import { Session } from '../db/models/session.js';
import { createSession } from '../utils/createSession.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { sendEmail } from '../utils/sendMails.js';
import { SMTP, TEMPLATES_DIR } from '../constants/index.js';

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

export async function requestResetToken(email) {
  const user = await User.findOne({ email: email });

  if (!user) throw createHttpError(404, 'User not found');

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    getEnvVar('JWT_SECRET'),
    {
      expiresIn: '5m',
    },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);

  const html = template({
    name: user.name,
    link: `${getEnvVar('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });
  try {
    await sendEmail({
      from: getEnvVar(SMTP.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch (error) {
    console.log(error);
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
}

export async function resetPassword(payload) {
  let entries;

  try {
    entries = jwt.verify(payload.token, getEnvVar('JWT_SECRET'));
  } catch (error) {
    if (
      error.message === 'invalid signature' ||
      error.message === 'jwt expired'
    )
      throw createHttpError(401, 'Token is expired or invalid.');
    throw error;
  }

  const user = await User.findOne({ email: entries.email, _id: entries.sub });

  if (!user) throw createHttpError(404, 'User not found!');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await User.updateOne({ _id: user._id }, { password: encryptedPassword });

  await Session.deleteOne({ userId: user._id });
}

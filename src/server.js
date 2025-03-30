import dotenv from 'dotenv';
dotenv.config();

import pino from 'pino-http';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import express from 'express';

import { getEnvVar } from './utils/getEnvVar.js';

import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

import routes from './routers/index.js';

const PORT = getEnvVar('PORT', 3000);

export async function setupServer() {
  const app = express();

  app.use(
    express.json({
      type: ['application/json', 'application/vnd.api+json'],
      limit: '100kb',
    }),
  );

  app.use(cookieParser());
  app.use(cors());

  // app.use(pino({ transport: { target: 'pino-pretty' } }));

  app.get('/', (req, res) => {
    res.json({ message: 'Not found' });
  });

  app.use(routes);

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

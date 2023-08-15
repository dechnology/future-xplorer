import mongoose from 'mongoose';
import * as Models from '@/server/models';

const { mongoUser, mongoPassword, mongoHost, mongoPort, mongoDb } =
  useRuntimeConfig();

export default defineNitroPlugin(async (nitroApp) => {
  try {
    const mongoUrl = `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}/${mongoDb}?authSource=admin`;
    console.log('Connecting to: ', mongoUrl);

    await mongoose.connect(mongoUrl);
    console.log('DB connection established');

    console.log('DB Models:', Object.keys(Models));
  } catch (err) {
    console.error('DB connection failed:', err);
  }
});

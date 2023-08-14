import mongoose from 'mongoose';

const { mongoUser, mongoPassword, mongoHost, mongoPort, mongoDb } =
  useRuntimeConfig();

export default defineNitroPlugin(async (nitroApp) => {
  try {
    const mongoUrl = `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}/${mongoDb}?authSource=admin`;
    console.log('Connecting to: ', mongoUrl);

    await mongoose.connect(mongoUrl);

    console.log('DB connection established');
  } catch (err) {
    console.error('DB connection failed:', err);
  }
});

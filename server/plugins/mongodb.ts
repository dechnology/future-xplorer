import * as fs from 'node:fs';
import mongoose from 'mongoose';
import * as Models from '@/server/models';

const { mongoUser, mongoPassword, mongoHost, mongoPort, mongoDb } =
  useRuntimeConfig();

export default defineNitroPlugin(async (nitroApp) => {
  try {
    const mongoUrl = `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}/${mongoDb}?authSource=admin`;
    console.log(`Connecting to mongodb as ${mongoUser}`);

    await mongoose.connect(mongoUrl);
    console.log('DB connection established');

    console.log('DB Models:', Object.keys(Models));

    const data = fs.readFileSync(
      '../history_cases/history-cases.json',
      'utf-8'
    );
    const historyCases = JSON.parse(data);

    for (const item of historyCases) {
      await Models.HistoryCaseModel.create(item);
    }
  } catch (err) {
    console.error('DB connection failed:', err);
  }
});

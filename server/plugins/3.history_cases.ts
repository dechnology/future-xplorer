import * as fs from 'node:fs';
import { HistoryCaseModel } from '@/server/models';
import { HistoryCase } from '~/types';

export default defineNitroPlugin(async (nitroApp) => {
  try {
    const data = fs.readFileSync('./history_cases/history-cases.json', 'utf-8');
    const historyCases: Partial<HistoryCase>[] = JSON.parse(data);

    await Promise.all(
      historyCases.map((item) =>
        HistoryCaseModel.updateOne({ _id: item._id }, item, { upsert: true })
      )
    );
  } catch (err) {
    console.error(err);
  }
});

import { BulkWriteResult } from 'mongodb';
import type { Keyword, ResourceObject } from '@/types';
import { KeywordModel } from '@/server/models';

export default defineEventHandler(
  async (event): Promise<ResourceObject<BulkWriteResult>> => {
    authenticate(event.context);
    const { updatedKeywords } = await readBody<{ updatedKeywords: Keyword[] }>(
      event
    );

    // Create an array of update operations
    const updateOperations = updatedKeywords.map((keyword) => ({
      updateOne: {
        filter: { _id: keyword._id },
        update: keyword,
        upsert: false, // Set to true if you want to insert the document if it doesn't exist
      },
    }));

    // Use bulkWrite to execute all update operations
    const bulkResult = await KeywordModel.bulkWrite(updateOperations);

    if (bulkResult.matchedCount === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No keywords found to update',
      });
    }

    return {
      message: `${bulkResult.modifiedCount} keywords successfully updated`,
      data: bulkResult, // Or return appropriate response here
    };
  }
);

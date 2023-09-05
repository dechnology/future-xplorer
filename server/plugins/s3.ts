import {
  GetObjectCommand,
  ListBucketsCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';

const getImage = async (bucket: string, key: string) => {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  try {
    const { Body } = await s3.send(command);

    if (!Body) {
      throw new Error('Body undefined');
    }

    console.log(await Body.transformToString());
  } catch (e) {
    console.error(e);
  }
};

const listBuckets = async () => {
  const command = new ListBucketsCommand({});
  const { Owner, Buckets } = await s3.send(command);

  if (!(Owner && Buckets)) {
    throw new Error('Owner or Buckets undefined');
  }

  console.log(
    `${Owner.DisplayName} owns ${Buckets.length} bucket${
      Buckets.length === 1 ? '' : 's'
    }:`
  );
  console.log(`${Buckets.map((b) => ` • ${b.Name}`).join('\n')}`);
};

export const listObjects = async (bucket: string) => {
  const command = new ListObjectsV2Command({
    Bucket: 'dechnology',
  });

  try {
    console.log('Your bucket contains the following objects:\n');

    let isTruncated = true;
    let contents = '';
    while (isTruncated) {
      const { Contents, IsTruncated, NextContinuationToken } =
        await s3.send(command);

      if (Contents === undefined) {
        throw new Error('Contents undefined');
      }

      const contentsList = Contents.map((c) => ` • ${c.Key}`).join('\n');
      contents += contentsList + '\n';
      isTruncated = Boolean(IsTruncated);
      command.input.ContinuationToken = NextContinuationToken;
    }
    console.log(contents);
  } catch (err) {
    console.error(err);
  }
};

export default defineNitroPlugin(async (nitroApp) => {
  try {
    listBuckets();
  } catch (e) {
    console.error(e);
  }
});

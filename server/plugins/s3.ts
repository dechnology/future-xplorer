import {
  S3Client,
  GetObjectCommand,
  ListBucketsCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';

const { s3AccessKeyId: accessKeyId, s3SecretAccessKey: secretAccessKey } =
  useRuntimeConfig();

const getImage = async (client: S3Client, bucket: string, key: string) => {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  try {
    const { Body } = await client.send(command);

    if (!Body) {
      throw new Error('Body undefined');
    }

    console.log(await Body.transformToString());
  } catch (e) {
    console.error(e);
  }
};

const listBuckets = async (client: S3Client) => {
  const command = new ListBucketsCommand({});
  const { Owner, Buckets } = await client.send(command);

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

export const listObjects = async (client: S3Client, bucket: string) => {
  const command = new ListObjectsV2Command({
    Bucket: 'dechnology',
  });

  try {
    console.log('Your bucket contains the following objects:\n');

    let isTruncated = true;
    let contents = '';
    while (isTruncated) {
      const { Contents, IsTruncated, NextContinuationToken } =
        await client.send(command);

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
    nitroApp.s3 = new S3Client({
      region: 'us-west-2',
      credentials: { accessKeyId, secretAccessKey },
    });
    console.log('s3 client connected');
    await listBuckets(nitroApp.s3);
    await listObjects(nitroApp.s3, 'dechnology');
    // await getImage(nitroApp.s3, 'dechnology', 'tdri/test.png');
  } catch (e) {
    console.error(e);
  }
});

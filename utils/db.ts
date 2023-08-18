import { AsyncData } from 'nuxt/app';
import { Serialize } from 'nitropack';
import { Base, ResourceObject } from '@/types';

interface FetchResourceOptions<T> {
  method: 'get' | 'post' | 'put' | 'delete';
  deserializer: (data: Serialize<T>) => T;
  body?: Record<string, any>;
}

export const fetchResource = async <T extends Base>(
  token: string,
  path: string,
  opts: Partial<FetchResourceOptions<T>> = {}
): Promise<ResourceObject<T>> => {
  const {
    method = 'get',
    deserializer = deserializerFactory<T>(),
    body,
  } = opts;

  const { data, error } = (await useFetch(path, {
    method,
    headers: { Authorization: `Bearer ${token}` },
    body,
  })) as AsyncData<ResourceObject<Serialize<T>> | null, Error>;

  if (error.value) {
    throw error.value;
  }

  if (!data.value) {
    throw new Error('data are null');
  }

  console.log('serialized: ', data.value);

  return { ...data.value, data: deserializer(data.value.data) };
};

export const fetchResources = async <T extends Base>(
  token: string,
  path: string,
  opts: Partial<FetchResourceOptions<T>> = {}
): Promise<ResourceObject<T[]>> => {
  const {
    method = 'get',
    deserializer = deserializerFactory<T>(),
    body,
  } = opts;

  const { data, error } = (await useFetch(path, {
    method,
    headers: { Authorization: `Bearer ${token}` },
    body,
  })) as AsyncData<ResourceObject<Serialize<T>[]> | null, Error>;

  if (error.value) {
    throw error.value;
  }

  if (!data.value) {
    throw new Error('data are null');
  }

  return { ...data.value, data: data.value.data.map((d) => deserializer(d)) };
};

// export const fetchIssueById = async (
//   workshopId: string,
//   issueId: string,
//   opts: { withWorkshop: boolean } = { withWorkshop: false }
// ): Promise<{ workshop?: BaseWorkshop; issue: Issue }> => {
//   const { data } = await useFetch(
//     `/api/workshops/${workshopId}/issues/${issueId}`
//   );

//   // Fetching error
//   if (data.value === null) {
//     throw createError({
//       statusCode: 400,
//       statusMessage: 'Failed to fetch workshop by id',
//     });
//   }

//   const { workshop: w, issue: i } = data.value;

//   return {
//     workshop: opts.withWorkshop ? deserializeBaseWorkshop(w) : undefined,
//     issue: deserializeIssue(i),
//   };
// };

// export const fetchWorkshopById = async (
//   id: string
// ): Promise<{ workshop: Workshop }> => {
//   const { data } = await useFetch(`/api/workshops/${id}`);

//   // Fetching error
//   if (data.value === null) {
//     throw createError({
//       statusCode: 400,
//       statusMessage: 'Failed to fetch workshop by id',
//     });
//   }

//   const { workshop: serializedWorkshop } = data.value;

//   return { workshop: deserializeWorkshop(serializedWorkshop) };
// };

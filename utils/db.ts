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

export const uploadImageUrl = async (
  token: string,
  url: string,
  key: string
): Promise<{ message?: string }> => {
  const { data, error } = await useFetch('/api/s3/images/urls', {
    method: 'post',
    headers: { Authorization: `Bearer ${token}` },
    body: { url, key },
  });

  if (error.value) {
    throw error.value;
  }

  if (!data.value) {
    throw new Error('data are null');
  }

  return data.value;
};

export const uploadImageFile = async (
  token: string,
  file: File,
  key: string
): Promise<{ message?: string }> => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('key', key);

  const { data, error } = await useFetch('/api/s3/images/files', {
    method: 'post',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (error.value) {
    throw error.value;
  }

  if (!data.value) {
    throw new Error('data are null');
  }

  return data.value;
};

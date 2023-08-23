import { v4 as uuidv4 } from 'uuid';
import { AsyncData } from 'nuxt/app';
import { Serialize } from 'nitropack';
import { Base, ResourceObject } from '@/types';

interface FetchResourceOptions<T> {
  method: 'get' | 'post' | 'put' | 'delete';
  deserializer: (data: Serialize<T>) => T;
  body?: Record<string, any>;
}

const baseFilepath = 'tdri/imgs/personas/originals';

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
  url: string
): Promise<ResourceObject<string>> => {
  const ext = url.split('?')[0].split('.').pop();
  const filepath = `${baseFilepath}/${uuidv4()}.${ext}`;

  const { data, error } = await useFetch('/api/s3/images/urls', {
    method: 'post',
    headers: { Authorization: `Bearer ${token}` },
    body: { url, key: filepath },
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
  file: File
): Promise<ResourceObject<string>> => {
  const filepath = `${baseFilepath}/${uuidv4()}.${file.type}`;
  const formData = new FormData();
  formData.append('image', file);
  formData.append('key', filepath);

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

export interface Workshop {
  name: string;
  description: string;
  creator: string;
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;

  startAt?: Date;
  endAt?: Date;

  objects: string[];
  environments: string[];
  messages: string[];
  services: string[];
}

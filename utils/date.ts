import { format } from 'date-fns';

export const formatDate = (
  dateObject?: Date,
  formatStr: string = 'yyyy-MM-dd'
) => (dateObject ? format(dateObject, formatStr) : '');

export const convertDateStr = (dateStr?: string) =>
  dateStr ? new Date(dateStr) : undefined;

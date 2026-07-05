import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

export const formatDateTime = (isoString: string): string => {
  if (!isoString) return '';
  return dayjs.utc(isoString).tz('Asia/Seoul').format('YYYY년 M월 D일 H시');
};

export const formatDateTimeMinute = (isoString: string): string => {
  if (!isoString) return '';
  return dayjs
    .utc(isoString)
    .tz('Asia/Seoul')
    .format('YYYY년 M월 D일 HH시 mm분');
};

export const formatLocalDateTimeMinute = (dateString: string): string => {
  if (!dateString) return '';

  const safeString = dateString.replace(' ', 'T');

  return dayjs.tz(safeString, 'Asia/Seoul').format('YYYY년 M월 D일 HH시 mm분');
};

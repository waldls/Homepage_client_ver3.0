import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const KST = 'Asia/Seoul';

/**
 * 서버 UTC-like 문자열 → KST datetime-local (input용)
 * ex) "2026-02-03T15:30:00" → "2026-02-04T00:30"
 */
export const toLocalInput = (utcLike?: string) => {
  if (!utcLike) return '';
  return dayjs.utc(utcLike).tz(KST).format('YYYY-MM-DDTHH:mm');
};

/**
 * KST datetime-local → 서버 UTC payload
 * ex) "2026-02-04T00:30" → "2026-02-03T15:30:00"
 */
export const toUtcPayload = (localKst?: string) => {
  if (!localKst) return '';
  return dayjs.tz(localKst, KST).utc().format('YYYY-MM-DDTHH:mm:ss');
};

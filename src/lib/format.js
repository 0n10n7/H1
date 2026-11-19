// Swedish date/time formatting, e.g. "Fre 20 nov 2026" and "08:30".

const DAYS = ['Sön', 'Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör'];
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];

/** @param {number} n */
const pad = (n) => String(n).padStart(2, '0');

/** @param {number} t timestamp in ms */
export const formatDate = (t, withYear = true) => {
  const d = new Date(t);
  const date = `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
  return withYear ? `${date} ${d.getFullYear()}` : date;
};

/** @param {number} t timestamp in ms */
export const formatTime = (t) => {
  const d = new Date(t);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

/** Value for <input type="date">, in local time. @param {number} t */
export const toDateInput = (t) => {
  const d = new Date(t);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

/** Value for <input type="time">, in local time. @param {number} t */
export const toTimeInput = (t) => formatTime(t);

/** Combines <input type="date"> and <input type="time"> values into a local timestamp. */
export const fromInputs = (/** @type {string} */ date, /** @type {string} */ time) => {
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  return new Date(y, m - 1, d, hh, mm).getTime();
};

/** Rounds a timestamp up to the next :00 or :30. @param {number} t */
export const ceilToHalfHour = (t) => Math.ceil(t / 1_800_000) * 1_800_000;

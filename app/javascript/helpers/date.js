/**
 * Return the date shifted by the timezone offset
 * @param {Date|number} dateOrTimestamp Date to offset
 */
export function applyTimezoneOffset(dateOrTimestamp) {
  const date = typeof dateOrTimestamp === 'number' ? new Date(dateOrTimestamp) : dateOrTimestamp;
  return new Date(date.getTime() + (date.getTimezoneOffset() * 60 * 1000));
}

/**
 * Return the date shifted by the opposite of the timezone offset
 * @param {Date|number} dateOrTimestamp Date to offset
 */
export function revertTimezoneOffset(dateOrTimestamp) {
  const date = typeof dateOrTimestamp === 'number' ? new Date(dateOrTimestamp) : dateOrTimestamp;
  return new Date(date.getTime() - (date.getTimezoneOffset() * 60 * 1000));
}

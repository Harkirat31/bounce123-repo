/**
 * Converts a UTC Date object to a local Date object
 * with the same year, month, and day, set to 00:00 local time.
 *
 * @param utcDate - A Date object in UTC
 * @returns A local Date object with same Y/M/D at midnight local time
 */
function toLocalDateOnlyFromUTC(isoDateString: string): Date {
  return new Date(isoDateString.slice(0,16))
  // const utcDate = new Date(isoDateString);
  // const year = utcDate.getUTCFullYear();
  // const month = utcDate.getUTCMonth(); // 0-based
  // const day = utcDate.getUTCDate();

  // return new Date(year, month, day); // Local time, midnight
}
export default toLocalDateOnlyFromUTC;